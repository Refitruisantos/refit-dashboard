import { MONTHS_SHORT, CHART_COLORS } from '@/lib/utils';
import type {
  CashflowRow,
  CategoryExpense,
  DashboardAlert,
  DashboardData,
  Goal,
  MonthlyRevenue,
  ServiceRevenue,
  TrendDirection,
  UpcomingEvent,
} from '@/types/dashboard';

/** Gerador determinístico para permitir demo sem backend. */
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1103515245 + 12345) % 2147483648;
    return value / 2147483648;
  };
}

const trendOf = (growth: number): TrendDirection => (growth > 0.5 ? 'up' : growth < -0.5 ? 'down' : 'flat');

const SERVICES = ['Personal Training', 'Pilates', 'Nutrição', 'Fisioterapia', 'Aulas', 'Avaliações'];
const CATEGORIES = [
  'Renda',
  'Salários',
  'Marketing',
  'Internet',
  'Água',
  'Luz',
  'Equipamentos',
  'Software',
  'Outros',
];

export function buildDashboardData(month: number, year: number): DashboardData {
  const rand = seeded(month * 977 + year);

  const revenueByMonth: MonthlyRevenue[] = MONTHS_SHORT.map((label, index) => {
    const base = 18500 + index * 950 + rand() * 4200;
    const expenses = base * (0.56 + rand() * 0.09);
    return {
      month: label,
      revenue: Math.round(base),
      expenses: Math.round(expenses),
      trend: Math.round(18500 + index * 1050),
    };
  });

  const currentIndex = Math.min(Math.max(month - 1, 0), 11);
  const current = revenueByMonth[currentIndex];
  const previous = revenueByMonth[Math.max(currentIndex - 1, 0)];

  const monthRevenue = current.revenue;
  const monthExpenses = current.expenses;
  const profit = monthRevenue - monthExpenses;
  const growth = ((monthRevenue - previous.revenue) / previous.revenue) * 100;
  const expenseGrowth = ((monthExpenses - previous.expenses) / previous.expenses) * 100;
  const profitPrev = previous.revenue - previous.expenses;
  const profitGrowth = ((profit - profitPrev) / profitPrev) * 100;

  const activeClients = 148 + Math.round(rand() * 34);
  const inactiveClients = 26 + Math.round(rand() * 16);
  const totalClients = activeClients + inactiveClients;
  const prevActive = activeClients - (4 + Math.round(rand() * 8));

  const revenueByService: ServiceRevenue[] = SERVICES.map((service, index) => {
    const weight = [0.34, 0.19, 0.14, 0.13, 0.13, 0.07][index];
    return {
      service,
      revenue: Math.round(monthRevenue * weight),
      sessions: Math.round(monthRevenue * weight) / 45,
      clients: Math.round(activeClients * weight),
    };
  });

  const rawCategories = [
    monthExpenses * 0.26,
    monthExpenses * 0.38,
    monthExpenses * 0.09,
    monthExpenses * 0.02,
    monthExpenses * 0.015,
    monthExpenses * 0.035,
    monthExpenses * 0.07,
    monthExpenses * 0.05,
    monthExpenses * 0.03,
  ];
  const expensesByCategory: CategoryExpense[] = CATEGORIES.map((category, index) => ({
    category,
    value: Math.round(rawCategories[index]),
    percent: Number(((rawCategories[index] / monthExpenses) * 100).toFixed(1)),
  })).sort((a, b) => b.value - a.value);

  const pendingPaymentsValue = Math.round(monthRevenue * 0.11);
  const pendingExpensesValue = Math.round(monthExpenses * 0.08);

  let balance = 24500;
  const cashflow: CashflowRow[] = revenueByMonth.slice(0, currentIndex + 1).map((row) => {
    const rowProfit = row.revenue - row.expenses;
    balance += rowProfit;
    return {
      month: row.month,
      inflow: row.revenue,
      outflow: row.expenses,
      profit: rowProfit,
      margin: Number(((rowProfit / row.revenue) * 100).toFixed(1)),
      balance: Math.round(balance),
    };
  });

  const fixedCosts = Math.round(monthExpenses * 0.72);
  const variableCosts = monthExpenses - fixedCosts;
  const averageTicket = Math.round(monthRevenue / (activeClients * 1.6));
  const mrr = Math.round(monthRevenue * 0.78);
  const churn = Number((2.4 + rand() * 1.8).toFixed(1));
  const retention = Number((100 - churn).toFixed(1));
  const cac = Math.round(58 + rand() * 30);
  const ltv = Math.round((monthRevenue / activeClients) * (100 / churn));

  const annualRevenue = revenueByMonth.slice(0, currentIndex + 1).reduce((sum, r) => sum + r.revenue, 0);
  const annualExpenses = revenueByMonth.slice(0, currentIndex + 1).reduce((sum, r) => sum + r.expenses, 0);

  const goals: Goal[] = [
    { id: 'revenue', label: 'Receita', current: monthRevenue, target: 32000, unit: 'currency', color: CHART_COLORS.green },
    { id: 'clients', label: 'Clientes', current: activeClients, target: 200, unit: 'number', color: CHART_COLORS.blue },
    { id: 'profit', label: 'Lucro', current: profit, target: 12000, unit: 'currency', color: CHART_COLORS.purple },
    { id: 'conversion', label: 'Conversão', current: Number((32 + rand() * 12).toFixed(1)), target: 50, unit: 'percent', color: CHART_COLORS.orange },
    { id: 'retention', label: 'Retenção', current: retention, target: 95, unit: 'percent', color: CHART_COLORS.red },
  ];

  const upcoming: UpcomingEvent[] = [
    { id: 'u1', date: isoIn(year, month, 2), description: 'Renovação mensalidades (28 clientes)', value: 3360, type: 'renewal' },
    { id: 'u2', date: isoIn(year, month, 4), description: 'Renda do estúdio', value: -1850, type: 'expense' },
    { id: 'u3', date: isoIn(year, month, 6), description: 'Processamento salários', value: -6400, type: 'expense' },
    { id: 'u4', date: isoIn(year, month, 9), description: 'Pagamentos pendentes em cobrança', value: pendingPaymentsValue, type: 'payment' },
    { id: 'u5', date: isoIn(year, month, 12), description: 'Workshop nutrição (12 inscritos)', value: 720, type: 'session' },
    { id: 'u6', date: isoIn(year, month, 16), description: 'Licença software gestão', value: -149, type: 'expense' },
  ];

  const alerts = buildAlerts({
    pendingPaymentsValue,
    pendingPaymentsCount: 9,
    pendingExpensesValue,
    pendingExpensesCount: 4,
    monthRevenue,
    revenueTarget: 32000,
    activeClients,
    clientTarget: 200,
    balance,
    profit,
  });

  return {
    updatedAt: new Date().toISOString(),
    period: { month, year },
    kpis: {
      activeClients: { value: activeClients, previous: prevActive, growth: ((activeClients - prevActive) / prevActive) * 100, trend: 'up' },
      revenue: { value: monthRevenue, previous: previous.revenue, growth, trend: trendOf(growth) },
      expenses: { value: monthExpenses, previous: previous.expenses, growth: expenseGrowth, trend: trendOf(expenseGrowth), extra: `${((monthExpenses / monthRevenue) * 100).toFixed(1)}% da receita` },
      profit: { value: profit, previous: profitPrev, growth: profitGrowth, trend: trendOf(profitGrowth), extra: `Margem ${((profit / monthRevenue) * 100).toFixed(1)}%` },
      pendingPayments: { value: pendingPaymentsValue, previous: Math.round(pendingPaymentsValue * 1.12), growth: -12, trend: 'down', count: 9 },
      pendingExpenses: { value: pendingExpensesValue, previous: Math.round(pendingExpensesValue * 0.9), growth: 10, trend: 'up', count: 4 },
    },
    metrics: {
      monthRevenue,
      annualRevenue,
      profit,
      netMargin: Number(((profit / monthRevenue) * 100).toFixed(1)),
      grossMargin: Number((((monthRevenue - variableCosts) / monthRevenue) * 100).toFixed(1)),
      ebitda: Math.round(profit * 1.08),
      averageTicket,
      revenuePerClient: Math.round(monthRevenue / activeClients),
      mrr,
      arr: mrr * 12,
      cashflow: Math.round(balance),
      burnRate: Math.round(monthExpenses / 30),
      fixedCosts,
      variableCosts,
      breakEven: Math.round(fixedCosts / (1 - variableCosts / monthRevenue)),
      churn,
      retention,
      ltv,
      cac,
      roi: Number((((monthRevenue - monthExpenses) / monthExpenses) * 100).toFixed(1)),
      monthlyGrowth: Number(growth.toFixed(1)),
      yoyGrowth: Number((((annualRevenue - annualExpenses) / annualExpenses) * 100).toFixed(1)),
    },
    revenueByService,
    clients: {
      active: activeClients,
      inactive: inactiveClients,
      total: totalClients,
      activePercent: Number(((activeClients / totalClients) * 100).toFixed(1)),
      inactivePercent: Number(((inactiveClients / totalClients) * 100).toFixed(1)),
    },
    newClients: {
      count: 14 + Math.round(rand() * 9),
      previous: 12 + Math.round(rand() * 6),
      growthRate: Number((8 + rand() * 22).toFixed(1)),
    },
    alerts,
    revenueByMonth,
    expensesByCategory,
    goals,
    cashflow,
    upcoming,
  };
}

function isoIn(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
}

interface AlertInput {
  pendingPaymentsValue: number;
  pendingPaymentsCount: number;
  pendingExpensesValue: number;
  pendingExpensesCount: number;
  monthRevenue: number;
  revenueTarget: number;
  activeClients: number;
  clientTarget: number;
  balance: number;
  profit: number;
}

/** Regras de alerta automáticas, partilhadas com a API. */
export function buildAlerts(input: AlertInput): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];

  if (input.pendingPaymentsValue > 0) {
    alerts.push({
      id: 'pending-payments',
      level: input.pendingPaymentsValue > input.monthRevenue * 0.1 ? 'danger' : 'warning',
      title: 'Pagamentos em atraso',
      message: `${input.pendingPaymentsCount} pagamentos por regularizar`,
      value: input.pendingPaymentsValue,
      metric: 'pendingPayments',
    });
  }

  if (input.pendingExpensesValue > 0) {
    alerts.push({
      id: 'pending-expenses',
      level: 'warning',
      title: 'Despesas pendentes',
      message: `${input.pendingExpensesCount} despesas aguardam pagamento`,
      value: input.pendingExpensesValue,
      metric: 'pendingExpenses',
    });
  }

  const revenueProgress = (input.monthRevenue / input.revenueTarget) * 100;
  alerts.push({
    id: 'revenue-goal',
    level: revenueProgress >= 100 ? 'success' : revenueProgress >= 75 ? 'info' : 'warning',
    title: 'Meta de receita',
    message: `${revenueProgress.toFixed(0)}% da meta mensal atingida`,
    value: input.monthRevenue,
    metric: 'revenueGoal',
  });

  const clientProgress = (input.activeClients / input.clientTarget) * 100;
  alerts.push({
    id: 'active-clients',
    level: clientProgress >= 90 ? 'success' : 'info',
    title: 'Clientes ativos',
    message: `${input.activeClients} de ${input.clientTarget} clientes (${clientProgress.toFixed(0)}%)`,
    value: input.activeClients,
    metric: 'activeClients',
  });

  if (input.balance < input.monthRevenue * 0.5) {
    alerts.push({
      id: 'low-cashflow',
      level: 'danger',
      title: 'Fluxo de caixa baixo',
      message: 'Saldo abaixo de meio mês de receita',
      value: input.balance,
      metric: 'cashflow',
    });
  } else {
    alerts.push({
      id: 'cashflow-ok',
      level: 'success',
      title: 'Fluxo de caixa saudável',
      message: 'Saldo suficiente para mais de 1 mês de operação',
      value: input.balance,
      metric: 'cashflow',
    });
  }

  if (input.profit < 0) {
    alerts.push({
      id: 'negative-profit',
      level: 'danger',
      title: 'Lucro negativo',
      message: 'As despesas superaram a receita neste período',
      value: input.profit,
      metric: 'profit',
    });
  }

  return alerts;
}
