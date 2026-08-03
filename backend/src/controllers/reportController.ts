import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Relatório de Gestão Mensal
export async function getManagementReport(req: Request, res: Response) {
  try {
    const { month, year } = req.query;

    const currentMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year as string) : new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // Mês anterior
    const prevStartDate = new Date(currentYear, currentMonth - 2, 1);
    const prevEndDate = new Date(currentYear, currentMonth - 1, 0, 23, 59, 59);

    // Mesmo período ano anterior
    const lastYearStartDate = new Date(currentYear - 1, currentMonth - 1, 1);
    const lastYearEndDate = new Date(currentYear - 1, currentMonth, 0, 23, 59, 59);

    const where = { expenseDate: { gte: startDate, lte: endDate } };
    const prevWhere = { expenseDate: { gte: prevStartDate, lte: prevEndDate } };
    const lastYearWhere = { expenseDate: { gte: lastYearStartDate, lte: lastYearEndDate } };

    // Receitas (Pagamentos pagos)
    const [revenue, prevRevenue, lastYearRevenue] = await Promise.all([
      prisma.payment.aggregate({
        where: { paidAt: { gte: startDate, lte: endDate }, status: 'paid' },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { paidAt: { gte: prevStartDate, lte: prevEndDate }, status: 'paid' },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { paidAt: { gte: lastYearStartDate, lte: lastYearEndDate }, status: 'paid' },
        _sum: { amount: true },
      }),
    ]);

    // Despesas (Despesas pagas)
    const [expenses, prevExpenses, lastYearExpenses] = await Promise.all([
      prisma.expense.aggregate({
        where: { ...where, status: 'paid' },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: { ...prevWhere, status: 'paid' },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: { ...lastYearWhere, status: 'paid' },
        _sum: { amount: true },
      }),
    ]);

    // Pagamentos
    const [paidPayments, pendingPayments, overduePayments] = await Promise.all([
      prisma.payment.count({
        where: { dueDate: { gte: startDate, lte: endDate }, status: 'paid' },
      }),
      prisma.payment.count({
        where: { dueDate: { gte: startDate, lte: endDate }, status: 'pending' },
      }),
      prisma.payment.count({
        where: { dueDate: { gte: startDate, lte: endDate }, status: 'overdue' },
      }),
    ]);

    const [paidPaymentsAmount, pendingPaymentsAmount, overduePaymentsAmount] = await Promise.all([
      prisma.payment.aggregate({
        where: { dueDate: { gte: startDate, lte: endDate }, status: 'paid' },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { dueDate: { gte: startDate, lte: endDate }, status: 'pending' },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { dueDate: { gte: startDate, lte: endDate }, status: 'overdue' },
        _sum: { amount: true },
      }),
    ]);

    // Clientes
    const [activeClients, newClients, inactiveClients] = await Promise.all([
      prisma.client.count({ where: { status: 'active' } }),
      prisma.client.count({
        where: { joinedAt: { gte: startDate, lte: endDate } },
      }),
      prisma.client.count({
        where: { status: 'inactive', updatedAt: { gte: startDate, lte: endDate } },
      }),
    ]);

    const totalRevenue = revenue._sum.amount || 0;
    const totalExpenses = expenses._sum.amount || 0;
    const profit = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    const prevTotalRevenue = prevRevenue._sum.amount || 0;
    const prevTotalExpenses = prevExpenses._sum.amount || 0;
    const prevProfit = prevTotalRevenue - prevTotalExpenses;

    const lastYearTotalRevenue = lastYearRevenue._sum.amount || 0;
    const lastYearTotalExpenses = lastYearExpenses._sum.amount || 0;
    const lastYearProfit = lastYearTotalRevenue - lastYearTotalExpenses;

    const avgRevenuePerClient = activeClients > 0 ? totalRevenue / activeClients : 0;

    res.json({
      period: { month: currentMonth, year: currentYear },
      revenue: {
        total: totalRevenue,
        prevMonth: prevTotalRevenue,
        lastYear: lastYearTotalRevenue,
        changeVsPrevMonth: prevTotalRevenue > 0 ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 : 0,
        changeVsLastYear: lastYearTotalRevenue > 0 ? ((totalRevenue - lastYearTotalRevenue) / lastYearTotalRevenue) * 100 : 0,
      },
      expenses: {
        total: totalExpenses,
        prevMonth: prevTotalExpenses,
        lastYear: lastYearTotalExpenses,
        changeVsPrevMonth: prevTotalExpenses > 0 ? ((totalExpenses - prevTotalExpenses) / prevTotalExpenses) * 100 : 0,
        changeVsLastYear: lastYearTotalExpenses > 0 ? ((totalExpenses - lastYearTotalExpenses) / lastYearTotalExpenses) * 100 : 0,
      },
      profit: {
        total: profit,
        prevMonth: prevProfit,
        lastYear: lastYearProfit,
        margin,
        changeVsPrevMonth: prevProfit !== 0 ? ((profit - prevProfit) / Math.abs(prevProfit)) * 100 : 0,
        changeVsLastYear: lastYearProfit !== 0 ? ((profit - lastYearProfit) / Math.abs(lastYearProfit)) * 100 : 0,
      },
      payments: {
        paid: { count: paidPayments, amount: paidPaymentsAmount._sum.amount || 0 },
        pending: { count: pendingPayments, amount: pendingPaymentsAmount._sum.amount || 0 },
        overdue: { count: overduePayments, amount: overduePaymentsAmount._sum.amount || 0 },
      },
      clients: {
        active: activeClients,
        new: newClients,
        inactive: inactiveClients,
        avgRevenue: avgRevenuePerClient,
      },
    });
  } catch (error) {
    console.error('Error generating management report:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório de gestão' });
  }
}

// Relatório de Receitas
export async function getRevenueReport(req: Request, res: Response) {
  try {
    const { startDate, endDate, groupBy } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate as string) : new Date();

    const payments = await prisma.payment.findMany({
      where: {
        paidAt: { gte: start, lte: end },
        status: 'paid',
      },
      include: {
        client: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
      orderBy: { paidAt: 'desc' },
    });

    let grouped: any = {};

    if (groupBy === 'client') {
      grouped = payments.reduce((acc: any, payment) => {
        const key = payment.client?.name || 'Sem cliente';
        if (!acc[key]) acc[key] = { total: 0, count: 0, payments: [] };
        acc[key].total += payment.amount;
        acc[key].count += 1;
        acc[key].payments.push(payment);
        return acc;
      }, {});
    } else if (groupBy === 'service') {
      grouped = payments.reduce((acc: any, payment) => {
        const key = payment.service?.name || 'Sem serviço';
        if (!acc[key]) acc[key] = { total: 0, count: 0, payments: [] };
        acc[key].total += payment.amount;
        acc[key].count += 1;
        acc[key].payments.push(payment);
        return acc;
      }, {});
    } else if (groupBy === 'month') {
      grouped = payments.reduce((acc: any, payment) => {
        const date = new Date(payment.paidAt!);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!acc[key]) acc[key] = { total: 0, count: 0, payments: [] };
        acc[key].total += payment.amount;
        acc[key].count += 1;
        acc[key].payments.push(payment);
        return acc;
      }, {});
    }

    const total = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      period: { start, end },
      total,
      count: payments.length,
      grouped: groupBy ? grouped : null,
      payments: !groupBy ? payments : null,
    });
  } catch (error) {
    console.error('Error generating revenue report:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório de receitas' });
  }
}

// Relatório de Despesas
export async function getExpensesReport(req: Request, res: Response) {
  try {
    const { startDate, endDate, groupBy } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate as string) : new Date();

    const expenses = await prisma.expense.findMany({
      where: {
        expenseDate: { gte: start, lte: end },
        status: 'paid',
      },
      orderBy: { expenseDate: 'desc' },
    });

    let grouped: any = {};

    if (groupBy === 'category') {
      grouped = expenses.reduce((acc: any, expense) => {
        const key = expense.category;
        if (!acc[key]) acc[key] = { total: 0, count: 0, expenses: [] };
        acc[key].total += expense.amount;
        acc[key].count += 1;
        acc[key].expenses.push(expense);
        return acc;
      }, {});
    } else if (groupBy === 'type') {
      grouped = expenses.reduce((acc: any, expense) => {
        const key = expense.type;
        if (!acc[key]) acc[key] = { total: 0, count: 0, expenses: [] };
        acc[key].total += expense.amount;
        acc[key].count += 1;
        acc[key].expenses.push(expense);
        return acc;
      }, {});
    } else if (groupBy === 'supplier') {
      grouped = expenses.reduce((acc: any, expense) => {
        const key = expense.supplier || 'Sem fornecedor';
        if (!acc[key]) acc[key] = { total: 0, count: 0, expenses: [] };
        acc[key].total += expense.amount;
        acc[key].count += 1;
        acc[key].expenses.push(expense);
        return acc;
      }, {});
    } else if (groupBy === 'month') {
      grouped = expenses.reduce((acc: any, expense) => {
        const date = new Date(expense.expenseDate);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!acc[key]) acc[key] = { total: 0, count: 0, expenses: [] };
        acc[key].total += expense.amount;
        acc[key].count += 1;
        acc[key].expenses.push(expense);
        return acc;
      }, {});
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      period: { start, end },
      total,
      count: expenses.length,
      grouped: groupBy ? grouped : null,
      expenses: !groupBy ? expenses : null,
    });
  } catch (error) {
    console.error('Error generating expenses report:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório de despesas' });
  }
}

// Relatório de Clientes
export async function getClientsReport(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate as string) : new Date();

    const [totalClients, activeClients, inactiveClients, newClients] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { status: 'active' } }),
      prisma.client.count({ where: { status: 'inactive' } }),
      prisma.client.count({
        where: { joinedAt: { gte: start, lte: end } },
      }),
    ]);

    const clientsWithRevenue = await prisma.client.findMany({
      where: { status: 'active' },
      include: {
        payments: {
          where: {
            paidAt: { gte: start, lte: end },
            status: 'paid',
          },
        },
        subscriptions: {
          where: { status: 'active' },
          include: { service: true },
        },
      },
    });

    const clientsData = clientsWithRevenue.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      joinedAt: client.joinedAt,
      revenue: client.payments.reduce((sum, p) => sum + p.amount, 0),
      paymentsCount: client.payments.length,
      service: client.subscriptions[0]?.service?.name || 'Sem serviço',
    }));

    res.json({
      period: { start, end },
      summary: {
        total: totalClients,
        active: activeClients,
        inactive: inactiveClients,
        new: newClients,
      },
      clients: clientsData,
    });
  } catch (error) {
    console.error('Error generating clients report:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório de clientes' });
  }
}

// Relatório de Serviços
export async function getServicesReport(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate as string) : new Date();

    const services = await prisma.service.findMany({
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { client: true },
        },
        payments: {
          where: {
            paidAt: { gte: start, lte: end },
            status: 'paid',
          },
        },
      },
    });

    const servicesData = services.map(service => ({
      id: service.id,
      name: service.name,
      price: service.price,
      activeClients: service.subscriptions.length,
      revenue: service.payments.reduce((sum, p) => sum + p.amount, 0),
      paymentsCount: service.payments.length,
    }));

    const totalRevenue = servicesData.reduce((sum, s) => sum + s.revenue, 0);

    res.json({
      period: { start, end },
      totalRevenue,
      services: servicesData,
    });
  } catch (error) {
    console.error('Error generating services report:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório de serviços' });
  }
}
