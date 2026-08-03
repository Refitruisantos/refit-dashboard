export type AlertLevel = 'success' | 'warning' | 'danger' | 'info';

export type TrendDirection = 'up' | 'down' | 'flat';

export interface KpiValue {
  value: number;
  previous: number;
  growth: number;
  trend: TrendDirection;
  count?: number;
  extra?: string;
}

export interface DashboardKpis {
  activeClients: KpiValue;
  revenue: KpiValue;
  expenses: KpiValue;
  profit: KpiValue;
  pendingPayments: KpiValue;
  pendingExpenses: KpiValue;
}

export interface ServiceRevenue {
  service: string;
  revenue: number;
  sessions: number;
  clients: number;
}

export interface ClientsBreakdown {
  active: number;
  inactive: number;
  total: number;
  activePercent: number;
  inactivePercent: number;
}

export interface NewClients {
  count: number;
  previous: number;
  growthRate: number;
}

export interface DashboardAlert {
  id: string;
  level: AlertLevel;
  title: string;
  message: string;
  value?: number;
  metric: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  trend: number;
  expenses: number;
}

export interface CategoryExpense {
  category: string;
  value: number;
  percent: number;
}

export interface Goal {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: 'currency' | 'number' | 'percent';
  color: string;
}

export interface CashflowRow {
  month: string;
  inflow: number;
  outflow: number;
  profit: number;
  margin: number;
  balance: number;
}

export interface UpcomingEvent {
  id: string;
  date: string;
  description: string;
  value: number;
  type: 'payment' | 'expense' | 'renewal' | 'session';
}

export interface FinancialMetrics {
  monthRevenue: number;
  annualRevenue: number;
  profit: number;
  netMargin: number;
  grossMargin: number;
  ebitda: number;
  averageTicket: number;
  revenuePerClient: number;
  mrr: number;
  arr: number;
  cashflow: number;
  burnRate: number;
  fixedCosts: number;
  variableCosts: number;
  breakEven: number;
  churn: number;
  retention: number;
  ltv: number;
  cac: number;
  roi: number;
  monthlyGrowth: number;
  yoyGrowth: number;
}

export interface DashboardData {
  updatedAt: string;
  period: { month: number; year: number };
  kpis: DashboardKpis;
  metrics: FinancialMetrics;
  revenueByService: ServiceRevenue[];
  clients: ClientsBreakdown;
  newClients: NewClients;
  alerts: DashboardAlert[];
  revenueByMonth: MonthlyRevenue[];
  expensesByCategory: CategoryExpense[];
  goals: Goal[];
  cashflow: CashflowRow[];
  upcoming: UpcomingEvent[];
}
