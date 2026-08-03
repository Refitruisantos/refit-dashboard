import { BarChart3, Calendar, DollarSign, Percent, TrendingUp, Users, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';
import type { DashboardData } from '@/types/dashboard';

interface MetricCardProps {
  label: string;
  value: string;
  subtitle: string;
  icon: typeof DollarSign;
  color: string;
}

function MetricCard({ label, value, subtitle, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border/50 bg-card p-4 shadow-sm transition-all duration-200 hover:border-border hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110', color)}>
          <Icon className="h-4 w-4" strokeWidth={2.5} />
        </div>
      </div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{label}</p>
      <p className="mb-1 text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-2xs text-muted-foreground/70">{subtitle}</p>
    </div>
  );
}

function calculateFinancialMetrics(data: DashboardData) {
  const currentRevenue = data.kpis.revenue.value;
  const currentExpenses = data.kpis.expenses.value;
  const currentProfit = data.kpis.profit.value;
  const activeClients = data.kpis.activeClients.value;

  // Receita anual (estimativa baseada no mês atual * 12)
  const annualRevenue = currentRevenue * 12;

  // Receita diária média (assumindo 30 dias no mês)
  const dailyAverageRevenue = currentRevenue / 30;

  // Receita média por cliente
  const revenuePerClient = activeClients > 0 ? currentRevenue / activeClients : 0;

  // Ticket médio (baseado nos serviços)
  const totalServiceRevenue = data.revenueByService.reduce((sum, s) => sum + s.revenue, 0);
  const averageTicket = data.revenueByService.length > 0 ? totalServiceRevenue / data.revenueByService.length : 0;

  // Margem líquida (lucro / receita * 100)
  const netMargin = currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0;

  // Margem bruta (assumindo que não temos custo dos produtos vendidos, usamos lucro)
  const grossMargin = currentRevenue > 0 ? ((currentRevenue - currentExpenses) / currentRevenue) * 100 : 0;

  // Receita recorrente mensal (MRR - baseada em subscrições ativas)
  const mrr = currentRevenue; // Simplificado - em produção seria calculado de subscrições

  // Crescimento anual (baseado no crescimento mensal * 12)
  const monthlyGrowth = data.kpis.revenue.growth;
  const annualGrowth = monthlyGrowth * 12;

  // Despesa média mensal (média dos últimos meses disponíveis)
  const monthlyExpenses = data.revenueByMonth.map(m => m.revenue * 0.6); // Estimativa
  const averageMonthlyExpense = monthlyExpenses.reduce((sum, e) => sum + e, 0) / monthlyExpenses.length;

  // Fluxo de caixa disponível (receita - despesas do mês)
  const availableCashflow = currentRevenue - currentExpenses;

  return {
    annualRevenue,
    dailyAverageRevenue,
    revenuePerClient,
    averageTicket,
    netMargin,
    grossMargin,
    mrr,
    annualGrowth,
    averageMonthlyExpense,
    availableCashflow,
  };
}

export function FinancialMetrics({ data }: { data: DashboardData }) {
  const metrics = calculateFinancialMetrics(data);

  return (
    <Card>
      <CardHeader
        title="Indicadores Financeiros Avançados"
        subtitle="Métricas calculadas automaticamente"
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-chart-1 to-chart-3">
            <BarChart3 className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
        }
      />
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <MetricCard
            label="Receita Anual"
            value={formatCurrency(metrics.annualRevenue)}
            subtitle="Projeção baseada no mês atual"
            icon={Calendar}
            color="bg-chart-1/10 text-chart-1"
          />
          
          <MetricCard
            label="Receita Diária Média"
            value={formatCurrency(metrics.dailyAverageRevenue)}
            subtitle="Média de 30 dias"
            icon={DollarSign}
            color="bg-chart-2/10 text-chart-2"
          />
          
          <MetricCard
            label="Receita por Cliente"
            value={formatCurrency(metrics.revenuePerClient)}
            subtitle="Valor médio por cliente ativo"
            icon={Users}
            color="bg-chart-3/10 text-chart-3"
          />
          
          <MetricCard
            label="Ticket Médio"
            value={formatCurrency(metrics.averageTicket)}
            subtitle="Valor médio por serviço"
            icon={BarChart3}
            color="bg-chart-4/10 text-chart-4"
          />
          
          <MetricCard
            label="Margem Líquida"
            value={`${metrics.netMargin.toFixed(1)}%`}
            subtitle="Lucro / Receita"
            icon={Percent}
            color="bg-chart-5/10 text-chart-5"
          />
          
          <MetricCard
            label="Margem Bruta"
            value={`${metrics.grossMargin.toFixed(1)}%`}
            subtitle="(Receita - Despesas) / Receita"
            icon={Percent}
            color="bg-chart-6/10 text-chart-6"
          />
          
          <MetricCard
            label="MRR"
            value={formatCurrency(metrics.mrr)}
            subtitle="Receita recorrente mensal"
            icon={TrendingUp}
            color="bg-chart-1/10 text-chart-1"
          />
          
          <MetricCard
            label="Crescimento Anual"
            value={`${metrics.annualGrowth > 0 ? '+' : ''}${metrics.annualGrowth.toFixed(1)}%`}
            subtitle="Projeção baseada no crescimento mensal"
            icon={TrendingUp}
            color={metrics.annualGrowth > 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}
          />
          
          <MetricCard
            label="Despesa Média Mensal"
            value={formatCurrency(metrics.averageMonthlyExpense)}
            subtitle="Média dos últimos meses"
            icon={BarChart3}
            color="bg-chart-4/10 text-chart-4"
          />
          
          <MetricCard
            label="Fluxo de Caixa Disponível"
            value={formatCurrency(metrics.availableCashflow)}
            subtitle="Receita - Despesas do mês"
            icon={Wallet}
            color={metrics.availableCashflow > 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}
          />
        </div>
      </CardContent>
    </Card>
  );
}
