import { useState } from 'react';
import { Target, Plus, Trash2, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGoals, useGoalsSummary, useDeleteGoal, useCompleteGoal } from '@/hooks/useGoals';
import { cn, formatCurrency } from '@/lib/utils';

export function ObjetivosPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  
  const { data: goals = [], isLoading } = useGoals({ status: filter === 'all' ? undefined : filter });
  const { data: summary } = useGoalsSummary();
  const deleteGoal = useDeleteGoal();
  const completeGoal = useCompleteGoal();

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja eliminar este objetivo?')) {
      try {
        await deleteGoal.mutateAsync(id);
      } catch (error) {
        alert('Erro ao eliminar objetivo');
      }
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeGoal.mutateAsync(id);
    } catch (error) {
      alert('Erro ao marcar objetivo');
    }
  };

  const getProgressColor = (status?: string) => {
    switch (status) {
      case 'achieved':
        return 'bg-success';
      case 'on_track':
        return 'bg-primary';
      case 'behind':
        return 'bg-warning';
      case 'overdue':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  const getProgressIcon = (status?: string) => {
    switch (status) {
      case 'achieved':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'on_track':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'behind':
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      financial: 'Financeiro',
      clients: 'Clientes',
      operations: 'Operações',
      custom: 'Personalizado',
    };
    return labels[category] || category;
  };

  const getMetricLabel = (metric: string) => {
    const labels: Record<string, string> = {
      monthly_revenue: 'Receita Mensal',
      annual_revenue: 'Receita Anual',
      monthly_profit: 'Lucro Mensal',
      annual_profit: 'Lucro Anual',
      max_expenses: 'Limite de Despesas',
      active_clients: 'Clientes Ativos',
      new_clients: 'Novos Clientes',
      retention_rate: 'Taxa de Retenção',
      avg_revenue_per_client: 'Receita Média/Cliente',
      activities_count: 'Atividades Realizadas',
      custom: 'Personalizado',
    };
    return labels[metric] || metric;
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '€') return formatCurrency(value);
    if (unit === '%') return `${value.toFixed(1)}%`;
    return `${Math.round(value)} ${unit}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shadow-sm">
                <Target className="h-6 w-6 text-primary" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Objetivos</h1>
                <p className="text-sm text-muted-foreground">Metas e progresso automático</p>
              </div>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Objetivo
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] p-6 pb-12">
        {/* Resumo */}
        {summary && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total de Objetivos</p>
                <p className="mt-2 text-2xl font-bold text-primary">{summary.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Atingidos</p>
                <p className="mt-2 text-2xl font-bold text-success">{summary.achieved}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">No Caminho</p>
                <p className="mt-2 text-2xl font-bold text-primary">{summary.onTrack}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Progresso Médio</p>
                <p className="mt-2 text-2xl font-bold">{summary.avgProgress}%</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <button onClick={() => setFilter('all')}
                className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80')}>
                Todos
              </button>
              <button onClick={() => setFilter('active')}
                className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  filter === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80')}>
                Ativos
              </button>
              <button onClick={() => setFilter('completed')}
                className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  filter === 'completed' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80')}>
                Concluídos
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Objetivos */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 animate-pulse rounded-lg bg-muted/20" />)}
          </div>
        ) : goals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">Nenhum objetivo encontrado</p>
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeiro Objetivo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {getProgressIcon(goal.progressStatus)}
                        <div>
                          <h3 className="font-semibold">{goal.name}</h3>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                              {getCategoryLabel(goal.category)}
                            </span>
                            <span>{getMetricLabel(goal.metric)}</span>
                            <span>•</span>
                            <span>{goal.periodicity === 'monthly' ? 'Mensal' : goal.periodicity === 'quarterly' ? 'Trimestral' : 'Anual'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progresso */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            {formatValue(goal.currentValue || 0, goal.unit)} / {formatValue(goal.target, goal.unit)}
                          </span>
                          <span className={cn("font-semibold",
                            goal.progressStatus === 'achieved' ? 'text-success' :
                            goal.progressStatus === 'on_track' ? 'text-primary' :
                            'text-destructive')}>
                            {Math.round(goal.progress || 0)}%
                          </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                          <div className={cn("h-full transition-all", getProgressColor(goal.progressStatus))}
                            style={{ width: `${Math.min(goal.progress || 0, 100)}%` }} />
                        </div>
                      </div>

                      {/* Datas */}
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Início: {new Date(goal.startDate).toLocaleDateString('pt-PT')}</span>
                        <span>•</span>
                        <span>Fim: {new Date(goal.endDate).toLocaleDateString('pt-PT')}</span>
                        {goal.isOverdue && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-destructive">Prazo ultrapassado</span>
                          </>
                        )}
                      </div>

                      {goal.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">{goal.notes}</p>
                      )}
                    </div>

                    <div className="flex gap-1">
                      {goal.status === 'active' && !goal.isAchieved && (
                        <button onClick={() => handleComplete(goal.id)}
                          className="rounded p-1.5 text-success transition-colors hover:bg-success/10" title="Marcar como concluído">
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(goal.id)}
                        className="rounded p-1.5 text-destructive transition-colors hover:bg-destructive/10" title="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
