import { ArrowDown, ArrowUp, Clock, CreditCard, HelpCircle, PiggyBank, Receipt, TrendingUp, Users } from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import type { DashboardKpis, TrendDirection } from '@/types/dashboard';

interface KpiCardProps {
  label: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon: typeof Users;
  color: string;
  description: string;
  tooltip: string;
  previousValue: string;
}

function KpiCard({ label, value, change, trend, icon: Icon, color, description, tooltip, previousValue }: KpiCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUp : ArrowDown;
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';
  const trendBg = trend === 'up' ? 'bg-success/10' : trend === 'down' ? 'bg-destructive/10' : 'bg-muted/10';

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Header com Ícone e Tooltip */}
      <div className="mb-4 flex items-start justify-between">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg shadow-sm transition-all duration-200 group-hover:shadow', color)}>
          <Icon className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div className="group/tooltip relative">
          <HelpCircle className="h-4 w-4 text-muted-foreground/50 transition-colors hover:text-muted-foreground" />
          <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-border/50 bg-card p-3 text-xs text-muted-foreground opacity-0 shadow-lg transition-opacity group-hover/tooltip:pointer-events-auto group-hover/tooltip:opacity-100">
            {tooltip}
          </div>
        </div>
      </div>

      {/* Label */}
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">{label}</p>

      {/* Valor Principal */}
      <p className="mb-1 text-3xl font-bold tracking-tight">{value}</p>

      {/* Descrição */}
      <p className="mb-3 text-2xs text-muted-foreground/70">{description}</p>

      {/* Crescimento e Comparação */}
      <div className="flex items-center justify-between gap-2">
        <div className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1', trendBg)}>
          {trend !== 'flat' && <TrendIcon className={cn('h-3 w-3', trendColor)} strokeWidth={3} />}
          <span className={cn('text-xs font-bold', trendColor)}>{change}</span>
        </div>
        <span className="text-2xs text-muted-foreground/60">vs {previousValue}</span>
      </div>
    </div>
  );
}

export function KpiCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-[200px] animate-pulse rounded-xl bg-muted/20" />
      ))}
    </div>
  );
}

export function KpiCards({ kpis }: { kpis: DashboardKpis }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        label="Clientes Ativos"
        value={formatNumber(kpis.activeClients.value)}
        change={formatSigned(kpis.activeClients.growth)}
        trend={kpis.activeClients.trend}
        icon={Users}
        color="bg-primary/10 text-primary"
        description="Total de clientes com subscrição ativa"
        tooltip="Clientes com subscrição ativa ou presença registada nos últimos 30 dias."
        previousValue={formatNumber(kpis.activeClients.previous)}
      />
      <KpiCard
        label="Receita do Mês"
        value={formatCurrency(kpis.revenue.value)}
        change={formatSigned(kpis.revenue.growth)}
        trend={kpis.revenue.trend}
        icon={TrendingUp}
        color="bg-success/10 text-success"
        description="Faturação total do período"
        tooltip="Soma de todos os pagamentos confirmados no período selecionado."
        previousValue={formatCurrency(kpis.revenue.previous)}
      />
      <KpiCard
        label="Despesas"
        value={formatCurrency(kpis.expenses.value)}
        change={formatSigned(kpis.expenses.growth)}
        trend={kpis.expenses.trend}
        icon={Receipt}
        color="bg-destructive/10 text-destructive"
        description="Custos operacionais do mês"
        tooltip="Total de despesas fixas e variáveis registadas no período."
        previousValue={formatCurrency(kpis.expenses.previous)}
      />
      <KpiCard
        label="Lucro"
        value={formatCurrency(kpis.profit.value)}
        change={formatSigned(kpis.profit.growth)}
        trend={kpis.profit.trend}
        icon={PiggyBank}
        color="bg-success/10 text-success"
        description="Receita menos despesas"
        tooltip="Lucro líquido calculado como receita total menos despesas totais do período."
        previousValue={formatCurrency(kpis.profit.previous)}
      />
      <KpiCard
        label="Pag. Pendentes"
        value={formatCurrency(kpis.pendingPayments.value)}
        change={formatSigned(kpis.pendingPayments.growth)}
        trend={kpis.pendingPayments.trend}
        icon={CreditCard}
        color="bg-warning/10 text-warning"
        description={`${kpis.pendingPayments.count ?? 0} pagamentos em atraso`}
        tooltip="Valores faturados que ainda não foram recebidos dos clientes."
        previousValue={formatCurrency(kpis.pendingPayments.previous)}
      />
      <KpiCard
        label="Desp. Pendentes"
        value={formatCurrency(kpis.pendingExpenses.value)}
        change={formatSigned(kpis.pendingExpenses.growth)}
        trend={kpis.pendingExpenses.trend}
        icon={Clock}
        color="bg-warning/10 text-warning"
        description={`${kpis.pendingExpenses.count ?? 0} despesas a liquidar`}
        tooltip="Despesas aprovadas que aguardam pagamento ao fornecedor."
        previousValue={formatCurrency(kpis.pendingExpenses.previous)}
      />
    </div>
  );
}

function formatSigned(value: number | undefined) {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.0%';
  }
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
}
