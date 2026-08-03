import { AlertCircle, CheckCircle2, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import type { DashboardData } from '@/types/dashboard';

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  icon: typeof TrendingUp;
  title: string;
  description: string;
}

function generateInsights(data: DashboardData): Insight[] {
  const insights: Insight[] = [];

  // Insight 1: Receita
  const revenueGrowth = data.kpis.revenue.growth;
  if (revenueGrowth > 0) {
    insights.push({
      id: 'revenue-up',
      type: 'success',
      icon: TrendingUp,
      title: `Receita aumentou ${revenueGrowth.toFixed(1)}%`,
      description: `Faturação de ${formatCurrency(data.kpis.revenue.value)} vs ${formatCurrency(data.kpis.revenue.previous)} no mês anterior.`,
    });
  } else if (revenueGrowth < 0) {
    insights.push({
      id: 'revenue-down',
      type: 'warning',
      icon: TrendingDown,
      title: `Receita diminuiu ${Math.abs(revenueGrowth).toFixed(1)}%`,
      description: `Faturação de ${formatCurrency(data.kpis.revenue.value)} vs ${formatCurrency(data.kpis.revenue.previous)} no mês anterior.`,
    });
  }

  // Insight 2: Lucro
  const profitGrowth = data.kpis.profit.growth;
  const expensesGrowth = data.kpis.expenses.growth;
  
  if (profitGrowth < 0 && expensesGrowth > 0) {
    insights.push({
      id: 'profit-expenses',
      type: 'warning',
      icon: AlertCircle,
      title: `Lucro diminuiu devido ao aumento das despesas`,
      description: `Despesas aumentaram ${expensesGrowth.toFixed(1)}% para ${formatCurrency(data.kpis.expenses.value)}, impactando o lucro em ${Math.abs(profitGrowth).toFixed(1)}%.`,
    });
  } else if (profitGrowth > 0) {
    insights.push({
      id: 'profit-up',
      type: 'success',
      icon: CheckCircle2,
      title: `Lucro aumentou ${profitGrowth.toFixed(1)}%`,
      description: `Margem de lucro de ${formatCurrency(data.kpis.profit.value)} com crescimento saudável.`,
    });
  }

  // Insight 3: Serviço mais rentável
  if (data.revenueByService.length > 0) {
    const topService = [...data.revenueByService].sort((a, b) => b.revenue - a.revenue)[0];
    insights.push({
      id: 'top-service',
      type: 'info',
      icon: Zap,
      title: `Serviço mais rentável: ${topService.service}`,
      description: `Gerou ${formatCurrency(topService.revenue)} em receita, representando ${((topService.revenue / data.kpis.revenue.value) * 100).toFixed(1)}% do total.`,
    });
  }

  // Insight 4: Pagamentos pendentes
  const pendingPaymentsCount = data.kpis.pendingPayments.count ?? 0;
  if (pendingPaymentsCount > 0) {
    insights.push({
      id: 'pending-payments',
      type: pendingPaymentsCount > 5 ? 'danger' : 'warning',
      icon: AlertCircle,
      title: `${pendingPaymentsCount} pagamentos pendentes`,
      description: `Total de ${formatCurrency(data.kpis.pendingPayments.value)} em valores a receber de clientes.`,
    });
  }

  // Insight 5: Despesas pendentes
  const pendingExpensesCount = data.kpis.pendingExpenses.count ?? 0;
  if (pendingExpensesCount > 0) {
    insights.push({
      id: 'pending-expenses',
      type: 'info',
      icon: AlertCircle,
      title: `${pendingExpensesCount} despesas em atraso`,
      description: `Total de ${formatCurrency(data.kpis.pendingExpenses.value)} aguardando pagamento a fornecedores.`,
    });
  }

  // Insight 6: Metas
  if (data.goals.length > 0) {
    const mainGoal = data.goals[0]; // Primeira meta (geralmente receita)
    const progress = Math.min((mainGoal.current / mainGoal.target) * 100, 100);
    
    if (progress >= 100) {
      insights.push({
        id: 'goal-achieved',
        type: 'success',
        icon: CheckCircle2,
        title: `Meta mensal atingida em ${progress.toFixed(0)}%`,
        description: `${mainGoal.label}: ${formatCurrency(mainGoal.current)} de ${formatCurrency(mainGoal.target)}.`,
      });
    } else if (progress >= 80) {
      insights.push({
        id: 'goal-near',
        type: 'info',
        icon: TrendingUp,
        title: `Meta mensal em ${progress.toFixed(0)}%`,
        description: `${mainGoal.label}: ${formatCurrency(mainGoal.current)} de ${formatCurrency(mainGoal.target)}. Faltam ${formatCurrency(mainGoal.target - mainGoal.current)}.`,
      });
    } else {
      insights.push({
        id: 'goal-low',
        type: 'warning',
        icon: AlertCircle,
        title: `Meta mensal em ${progress.toFixed(0)}%`,
        description: `${mainGoal.label}: ${formatCurrency(mainGoal.current)} de ${formatCurrency(mainGoal.target)}. Necessário acelerar.`,
      });
    }
  }

  // Insight 7: Clientes ativos
  const clientsGrowth = data.kpis.activeClients.growth;
  if (clientsGrowth > 0) {
    insights.push({
      id: 'clients-up',
      type: 'success',
      icon: TrendingUp,
      title: `Clientes ativos aumentaram ${clientsGrowth.toFixed(1)}%`,
      description: `Total de ${formatNumber(data.kpis.activeClients.value)} clientes ativos vs ${formatNumber(data.kpis.activeClients.previous)} no mês anterior.`,
    });
  } else if (clientsGrowth < 0) {
    insights.push({
      id: 'clients-down',
      type: 'warning',
      icon: TrendingDown,
      title: `Clientes ativos diminuíram ${Math.abs(clientsGrowth).toFixed(1)}%`,
      description: `Total de ${formatNumber(data.kpis.activeClients.value)} clientes ativos. Necessário ações de retenção.`,
    });
  }

  return insights;
}

const INSIGHT_STYLES = {
  success: 'border-success/20 bg-success/5',
  warning: 'border-warning/20 bg-warning/5',
  info: 'border-info/20 bg-info/5',
  danger: 'border-destructive/20 bg-destructive/5',
};

const INSIGHT_ICON_STYLES = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
  danger: 'bg-destructive/10 text-destructive',
};

export function ExecutiveSummary({ data }: { data: DashboardData }) {
  const insights = generateInsights(data);

  return (
    <Card>
      <CardHeader
        title="Resumo Executivo"
        subtitle="Insights automáticos do período"
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-chart-5 to-chart-2">
            <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
        }
      />
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div
                key={insight.id}
                className={cn(
                  'group relative overflow-hidden rounded-lg border p-4 transition-all duration-200 hover:shadow-md',
                  INSIGHT_STYLES[insight.type]
                )}
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', INSIGHT_ICON_STYLES[insight.type])}>
                    <Icon className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                </div>
                <h4 className="mb-1.5 text-sm font-semibold leading-tight">{insight.title}</h4>
                <p className="text-xs leading-relaxed text-muted-foreground">{insight.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
