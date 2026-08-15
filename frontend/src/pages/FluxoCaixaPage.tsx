import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCashFlowMovements, useCashFlowSummary, useDeleteCashFlowMovement } from '@/hooks/useCashFlow';
import { cn, formatCurrency } from '@/lib/utils';

export function FluxoCaixaPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'realized' | 'forecast' | 'all'>('all');

  const { data: summary, isLoading: loadingSummary } = useCashFlowSummary(selectedMonth, selectedYear);
  const { data: movements = [], isLoading: loadingMovements } = useCashFlowMovements();
  const deleteMovement = useDeleteCashFlowMovement();

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleDelete = async (id: string, origin: string) => {
    if (origin !== 'manual') {
      alert('Apenas movimentos manuais podem ser eliminados. Pagamentos e despesas devem ser geridos nos respetivos módulos.');
      return;
    }
    
    if (confirm('Tem certeza que deseja eliminar este movimento?')) {
      try {
        await deleteMovement.mutateAsync(id);
      } catch (error) {
        alert('Erro ao eliminar movimento');
      }
    }
  };

  const filteredMovements = movements.filter(m => {
    if (viewMode === 'realized') return m.status === 'realized';
    if (viewMode === 'forecast') return m.status === 'forecast';
    return true;
  });

  const getOriginLabel = (origin: string) => {
    const labels: Record<string, string> = {
      payment: 'Pagamento',
      expense: 'Despesa',
      manual: 'Manual',
    };
    return labels[origin] || origin;
  };

  const getOriginColor = (origin: string) => {
    const colors: Record<string, string> = {
      payment: 'text-success',
      expense: 'text-destructive',
      manual: 'text-primary',
    };
    return colors[origin] || 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shadow-sm">
                <DollarSign className="h-6 w-6 text-primary" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Fluxo de Caixa</h1>
                <p className="text-sm text-muted-foreground">Visão financeira completa</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] p-6 pb-12">
        {/* Seletor de Período */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mês</label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ano</label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {[2024, 2025, 2026, 2027].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="ml-auto">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visualização</label>
                <div className="flex gap-1 rounded-lg border border-border bg-background p-1">
                  <button onClick={() => setViewMode('realized')}
                    className={cn('rounded px-3 py-1 text-sm font-medium transition-colors',
                      viewMode === 'realized' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
                    Realizado
                  </button>
                  <button onClick={() => setViewMode('forecast')}
                    className={cn('rounded px-3 py-1 text-sm font-medium transition-colors',
                      viewMode === 'forecast' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
                    Previsto
                  </button>
                  <button onClick={() => setViewMode('all')}
                    className={cn('rounded px-3 py-1 text-sm font-medium transition-colors',
                      viewMode === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
                    Tudo
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        {summary && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Saldo Atual</p>
                <p className={cn("mt-2 text-2xl font-bold", summary.currentBalance >= 0 ? "text-success" : "text-destructive")}>
                  {formatCurrency(summary.currentBalance)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Apenas movimentos realizados</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Entradas do Mês</p>
                <p className="mt-2 text-2xl font-bold text-success">{formatCurrency(summary.inflows.realized)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Previsto: {formatCurrency(summary.inflows.forecast)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Saídas do Mês</p>
                <p className="mt-2 text-2xl font-bold text-destructive">{formatCurrency(summary.outflows.realized)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Previsto: {formatCurrency(summary.outflows.forecast)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Saldo Previsto</p>
                <p className={cn("mt-2 text-2xl font-bold", summary.forecastBalance >= 0 ? "text-primary" : "text-warning")}>
                  {formatCurrency(summary.forecastBalance)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fluxo líquido: {formatCurrency(summary.netCashFlow)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resumo Visual */}
        {summary && (
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader title="Realizado" subtitle="Movimentos efetivos" />
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle className="h-5 w-5 text-success" />
                      <span className="text-sm font-medium">Entradas</span>
                    </div>
                    <span className="text-lg font-bold text-success">{formatCurrency(summary.inflows.realized)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="h-5 w-5 text-destructive" />
                      <span className="text-sm font-medium">Saídas</span>
                    </div>
                    <span className="text-lg font-bold text-destructive">{formatCurrency(summary.outflows.realized)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Saldo</span>
                      <span className={cn("text-xl font-bold", summary.currentBalance >= 0 ? "text-success" : "text-destructive")}>
                        {formatCurrency(summary.currentBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Previsto" subtitle="Movimentos futuros" />
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle className="h-5 w-5 text-success/60" />
                      <span className="text-sm font-medium">Entradas</span>
                    </div>
                    <span className="text-lg font-bold text-success/80">{formatCurrency(summary.inflows.forecast)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="h-5 w-5 text-destructive/60" />
                      <span className="text-sm font-medium">Saídas</span>
                    </div>
                    <span className="text-lg font-bold text-destructive/80">{formatCurrency(summary.outflows.forecast)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Saldo Previsto</span>
                      <span className={cn("text-xl font-bold", summary.forecastBalance >= 0 ? "text-primary" : "text-warning")}>
                        {formatCurrency(summary.forecastBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Histórico de Movimentos */}
        <Card>
          <CardHeader title="Histórico de Movimentos" 
            subtitle={`${filteredMovements.length} ${filteredMovements.length === 1 ? 'movimento' : 'movimentos'}`}
            icon={<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" strokeWidth={2.5} />
            </div>} />
          <CardContent>
            {loadingMovements ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted/20" />)}
              </div>
            ) : filteredMovements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">Nenhum movimento encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3">Data</th>
                      <th className="pb-3">Descrição</th>
                      <th className="pb-3">Origem</th>
                      <th className="pb-3">Categoria</th>
                      <th className="pb-3 text-right">Entrada</th>
                      <th className="pb-3 text-right">Saída</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovements.map((movement) => (
                      <tr key={movement.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                        <td className="py-3 text-sm">{new Date(movement.date).toLocaleDateString('pt-PT')}</td>
                        <td className="py-3">
                          <p className="font-medium">{movement.description}</p>
                          {movement.notes && <p className="text-xs text-muted-foreground">{movement.notes}</p>}
                        </td>
                        <td className="py-3">
                          <span className={cn("text-sm font-medium", getOriginColor(movement.origin))}>
                            {getOriginLabel(movement.origin)}
                          </span>
                        </td>
                        <td className="py-3 text-sm">{movement.category || '-'}</td>
                        <td className="py-3 text-right">
                          {movement.type === 'inflow' && (
                            <span className="font-semibold text-success">{formatCurrency(movement.amount)}</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          {movement.type === 'outflow' && (
                            <span className="font-semibold text-destructive">{formatCurrency(movement.amount)}</span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                            movement.status === 'realized' ? 'border-success/20 bg-success/10 text-success' : 'border-warning/20 bg-warning/10 text-warning')}>
                            {movement.status === 'realized' ? 'Realizado' : 'Previsto'}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex justify-end gap-1">
                            {movement.origin === 'manual' && (
                              <button onClick={() => handleDelete(movement.id, movement.origin)}
                                className="rounded p-1.5 text-destructive transition-colors hover:bg-destructive/10" title="Eliminar">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
