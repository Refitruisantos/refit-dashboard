import { Router } from 'express';
import * as metrics from '../services/metricsService.js';
import { buildAlerts } from '../services/alertsService.js';
import { prisma } from '../lib/db.js';

const router = Router();

router.get('/dashboard', async (req, res) => {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();
    const query = { month, year };

    const [
      activeClients,
      revenue,
      expenses,
      pendingPayments,
      pendingExpenses,
      revenueByService,
      clients,
      newClients,
      expensesByCategory,
    ] = await Promise.all([
      metrics.getActiveClients(query),
      metrics.getRevenue(query),
      metrics.getExpenses(query),
      metrics.getPendingPayments(query),
      metrics.getPendingExpenses(query),
      metrics.getRevenueByService(query),
      metrics.getClientsBreakdown(),
      metrics.getNewClients(query),
      metrics.getExpensesByCategory(query),
    ]);

    // TEMPORÁRIO: Usar array vazio até migrar BD
    const goals: any[] = [];

    const profit = revenue.value - expenses.value;
    const profitPrev = revenue.previous - expenses.previous;
    const profitGrowth = profitPrev > 0 ? ((profit - profitPrev) / profitPrev) * 100 : 0;

    // Obter saldo inicial das configurações
    // TEMPORÁRIO: Usar 0 até migrar BD
    const initialBalance = 0;

    // Calcular saldo atual (inicial + todas as entradas - todas as saídas)
    const [totalInflows, totalOutflows] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true },
      }),
    ]);

    const currentBalance = initialBalance + (totalInflows._sum.amount || 0) - (totalOutflows._sum.amount || 0);

    const alerts = buildAlerts({
      pendingPaymentsValue: pendingPayments.value,
      pendingPaymentsCount: pendingPayments.count,
      pendingExpensesValue: pendingExpenses.value,
      pendingExpensesCount: pendingExpenses.count,
      monthRevenue: revenue.value,
      revenueTarget: goals.find((g) => g.metric === 'revenue')?.target ?? 0,
      activeClients: activeClients.value,
      clientTarget: goals.find((g) => g.metric === 'clients')?.target ?? 0,
      balance: currentBalance,
      profit,
    });

    // Calcular receitas e despesas reais por mês
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const revenueByMonthData = await Promise.all(
      Array.from({ length: month }, async (_, i) => {
        const monthNum = i + 1;
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0, 23, 59, 59);

        const [monthRevenue, monthExpenses] = await Promise.all([
          prisma.payment.aggregate({
            where: {
              paidAt: { gte: startDate, lte: endDate },
              status: 'paid',
            },
            _sum: { amount: true },
          }),
          prisma.expense.aggregate({
            where: {
              paidAt: { gte: startDate, lte: endDate },
              status: 'paid',
            },
            _sum: { amount: true },
          }),
        ]);

        return {
          month: monthNames[i],
          revenue: monthRevenue._sum.amount || 0,
          expenses: monthExpenses._sum.amount || 0,
        };
      })
    );

    const cashflow = revenueByMonthData.map((row, index) => {
      const profit = row.revenue - row.expenses;
      const margin = row.revenue > 0 ? Number(((profit / row.revenue) * 100).toFixed(1)) : 0;
      
      return {
        month: row.month,
        inflow: Math.round(row.revenue),
        outflow: Math.round(row.expenses),
        profit: Math.round(profit),
        margin,
        balance: 0, // Será calculado do saldo inicial nas configurações
      };
    });

    // Próximos pagamentos e despesas pendentes
    const upcomingPayments = await prisma.payment.findMany({
      where: {
        status: { in: ['pending', 'overdue'] },
        dueDate: { gte: new Date() },
      },
      include: { client: { select: { name: true } } },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    const upcomingExpenses = await prisma.expense.findMany({
      where: {
        status: { in: ['pending', 'overdue'] },
        dueDate: { gte: new Date() },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    const upcoming = [
      ...upcomingPayments.map(p => ({
        id: p.id,
        date: p.dueDate.toISOString(),
        description: `Pagamento - ${p.client?.name || 'Cliente'}`,
        value: p.amount,
        type: 'payment' as const,
      })),
      ...upcomingExpenses.map(e => ({
        id: e.id,
        date: e.dueDate.toISOString(),
        description: e.description,
        value: -e.amount,
        type: 'expense' as const,
      })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 10);

    res.json({
      updatedAt: new Date().toISOString(),
      period: { month, year },
      kpis: {
        activeClients,
        revenue,
        expenses: {
          ...expenses,
          extra: `${((expenses.value / revenue.value) * 100).toFixed(1)}% da receita`,
        },
        profit: {
          value: profit,
          previous: profitPrev,
          growth: profitGrowth,
          trend: profitGrowth > 0.5 ? 'up' : profitGrowth < -0.5 ? 'down' : 'flat',
          extra: `Margem ${((profit / revenue.value) * 100).toFixed(1)}%`,
        },
        pendingPayments: {
          value: pendingPayments.value,
          count: pendingPayments.count,
        },
        pendingExpenses: {
          value: pendingExpenses.value,
          count: pendingExpenses.count,
        },
      },
      metrics: {
        monthRevenue: revenue.value,
        annualRevenue: revenue.value * month,
        profit,
        netMargin: revenue.value > 0 ? Number(((profit / revenue.value) * 100).toFixed(1)) : 0,
        cashflow: currentBalance,
        burnRate: Math.round(expenses.value / 30),
        revenuePerClient: activeClients.value > 0 ? Math.round(revenue.value / activeClients.value) : 0,
        roi: expenses.value > 0 ? Number((((revenue.value - expenses.value) / expenses.value) * 100).toFixed(1)) : 0,
        monthlyGrowth: Number(revenue.growth.toFixed(1)),
      },
      revenueByService,
      clients,
      newClients,
      alerts,
      revenueByMonth: revenueByMonthData,
      expensesByCategory,
      goals: goals.map((g) => ({
        id: g.id,
        label: g.metric.charAt(0).toUpperCase() + g.metric.slice(1),
        current: g.metric === 'revenue' ? revenue.value : g.metric === 'clients' ? activeClients.value : profit,
        target: g.target,
        unit: g.unit as 'currency' | 'number' | 'percent',
        color: g.color,
      })),
      cashflow,
      upcoming,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Erro ao obter dados do dashboard' });
  }
});

export default router;
