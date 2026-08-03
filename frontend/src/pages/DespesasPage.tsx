import { useState } from 'react';
import { Receipt, Plus, Edit2, Trash2, Copy, TrendingUp, TrendingDown, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useExpenses, useExpensesSummary, useDeleteExpense, useDuplicateExpense } from '@/hooks/useExpenses';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { cn, formatCurrency } from '@/lib/utils';

interface Expense {
  id: string;
  description: string;
  category: string;
  supplier?: string;
  amount: number;
  expenseDate: string;
  dueDate: string;
  paidAt?: string;
  method?: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  type: 'fixed' | 'variable' | 'extraordinary';
  recurrence: 'once' | 'monthly' | 'quarterly' | 'biannual' | 'annual';
  notes?: string;
}

export function DespesasPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: expenses = [], isLoading } = useExpenses();
  const { data: summary } = useExpensesSummary(currentMonth, currentYear);
  const deleteExpense = useDeleteExpense();
  const duplicateExpense = useDuplicateExpense();

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja eliminar esta despesa?')) {
      try {
        await deleteExpense.mutateAsync(id);
      } catch (error) {
        alert('Erro ao eliminar despesa');
      }
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateExpense.mutateAsync(id);
    } catch (error) {
      alert('Erro ao duplicar despesa');
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    const matchesStatus = !statusFilter || expense.status === statusFilter;
    const matchesType = !typeFilter || expense.type === typeFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success/10 text-success border-success/20';
      case 'overdue': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'cancelled': return 'bg-muted/50 text-muted-foreground border-border';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: 'Pago',
      overdue: 'Em Atraso',
      pending: 'Pendente',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fixed: 'Fixa',
      variable: 'Variável',
      extraordinary: 'Extraordinária',
    };
    return labels[type] || type;
  };

  const getRecurrenceLabel = (recurrence: string) => {
    const labels: Record<string, string> = {
      once: 'Única',
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      biannual: 'Semestral',
      annual: 'Anual',
    };
    return labels[recurrence] || recurrence;
  };

  const getMethodLabel = (method?: string) => {
    const labels: Record<string, string> = {
      mbway: 'MB Way',
      transfer: 'Transferência',
      cash: 'Numerário',
      card: 'Cartão',
      debit: 'Débito Direto',
      other: 'Outro',
    };
    return method ? labels[method] || method : '-';
  };

  const categories = Array.from(new Set(expenses.map(e => e.category))).sort();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 shadow-sm">
                <Receipt className="h-6 w-6 text-destructive" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Gestão de Despesas</h1>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? 'A carregar...' : `${expenses.length} despesas registadas`}
                </p>
              </div>
            </div>
            <Button onClick={() => { setEditingExpense(null); setShowForm(true); }} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Despesa
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] p-6 pb-12">
        {summary && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Despesas do Mês</p>
                <p className="mt-2 text-2xl font-bold text-destructive">{formatCurrency(summary.totalMonth)}</p>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {summary.variation > 0 ? (
                    <><TrendingUp className="h-3 w-3 text-destructive" /><span className="text-destructive">+{summary.variation}%</span></>
                  ) : summary.variation < 0 ? (
                    <><TrendingDown className="h-3 w-3 text-success" /><span className="text-success">{summary.variation}%</span></>
                  ) : (
                    <span className="text-muted-foreground">Sem variação</span>
                  )}
                  <span className="text-muted-foreground">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Despesas Pagas</p>
                <p className="mt-2 text-2xl font-bold text-success">{formatCurrency(summary.totalPaid)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Efetivamente pagas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Despesas Pendentes</p>
                <p className="mt-2 text-2xl font-bold text-warning">{formatCurrency(summary.totalPending)}</p>
                <p className="mt-1 text-xs text-muted-foreground">A pagar</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Despesas em Atraso</p>
                <p className="mt-2 text-2xl font-bold text-destructive">{formatCurrency(summary.totalOverdue)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Requer atenção</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Impacto no Caixa</p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {formatCurrency(summary.totalPaid)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Caixa realizado</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Pesquisar despesa..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 rounded-lg border border-border bg-background px-3 py-1.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Todas as categorias</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Todos os estados</option>
                  <option value="paid">Pago</option>
                  <option value="pending">Pendente</option>
                  <option value="overdue">Em Atraso</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Todos os tipos</option>
                  <option value="fixed">Fixa</option>
                  <option value="variable">Variável</option>
                  <option value="extraordinary">Extraordinária</option>
                </select>
              </div>

              {(searchTerm || categoryFilter || statusFilter || typeFilter) && (
                <button onClick={() => { setSearchTerm(''); setCategoryFilter(''); setStatusFilter(''); setTypeFilter(''); }}
                  className="text-sm text-muted-foreground hover:text-foreground">
                  Limpar filtros
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Despesas" subtitle={`${filteredExpenses.length} ${filteredExpenses.length === 1 ? 'despesa' : 'despesas'}`}
            icon={<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
              <Receipt className="h-4 w-4 text-destructive" strokeWidth={2.5} />
            </div>} />
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-20 animate-pulse rounded-lg bg-muted/20" />)}
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Receipt className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {searchTerm || categoryFilter || statusFilter || typeFilter
                    ? 'Nenhuma despesa encontrada com os filtros aplicados'
                    : 'Nenhuma despesa registada'}
                </p>
                <Button onClick={() => setShowForm(true)} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Primeira Despesa
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3">Descrição</th>
                      <th className="pb-3">Categoria</th>
                      <th className="pb-3">Fornecedor</th>
                      <th className="pb-3">Valor</th>
                      <th className="pb-3">Data</th>
                      <th className="pb-3">Vencimento</th>
                      <th className="pb-3">Tipo</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                        <td className="py-3">
                          <p className="font-medium">{expense.description}</p>
                          {expense.recurrence !== 'once' && (
                            <p className="text-xs text-muted-foreground">{getRecurrenceLabel(expense.recurrence)}</p>
                          )}
                        </td>
                        <td className="py-3 text-sm">{expense.category}</td>
                        <td className="py-3 text-sm">{expense.supplier || '-'}</td>
                        <td className="py-3">
                          <p className="font-semibold text-destructive">{formatCurrency(expense.amount)}</p>
                        </td>
                        <td className="py-3 text-sm">{new Date(expense.expenseDate).toLocaleDateString('pt-PT')}</td>
                        <td className="py-3 text-sm">{new Date(expense.dueDate).toLocaleDateString('pt-PT')}</td>
                        <td className="py-3 text-sm">{getTypeLabel(expense.type)}</td>
                        <td className="py-3">
                          <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium', getStatusColor(expense.status))}>
                            {getStatusLabel(expense.status)}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => handleDuplicate(expense.id)}
                              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Duplicar">
                              <Copy className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleEdit(expense)}
                              className="rounded p-1.5 text-primary transition-colors hover:bg-primary/10" title="Editar">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(expense.id)}
                              className="rounded p-1.5 text-destructive transition-colors hover:bg-destructive/10" title="Eliminar">
                              <Trash2 className="h-4 w-4" />
                            </button>
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

      {showForm && (
        <ExpenseForm
          expense={editingExpense || undefined}
          onClose={() => { setShowForm(false); setEditingExpense(null); }}
          onSuccess={() => { setShowForm(false); setEditingExpense(null); }}
        />
      )}
    </div>
  );
}
