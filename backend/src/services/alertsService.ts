export interface AlertInput {
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

export type AlertLevel = 'success' | 'warning' | 'danger' | 'info';

export interface DashboardAlert {
  id: string;
  level: AlertLevel;
  title: string;
  message: string;
  value?: number;
  metric: string;
}

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
