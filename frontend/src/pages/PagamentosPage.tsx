import { useState } from 'react';
import { CreditCard, Plus, Edit2, Trash2, CheckCircle2, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePayments, usePaymentsSummary, useDeletePayment } from '@/hooks/usePayments';
import { PaymentForm } from '@/components/forms/PaymentForm';
import { cn, formatCurrency } from '@/lib/utils';

interface Payment {
  id: string;
  clientId: string;
  serviceId?: string;
  amount: number;
  period?: string;
  dueDate: string;
  paidAt?: string;
  method?: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  notes?: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
  service?: {
    id: string;
    name: string;
    price: number;
  };
}

export function PagamentosPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [monthFilter, setMonthFilter] = useState('');

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: payments = [], isLoading } = usePayments();
  const { data: summary } = usePaymentsSummary(currentMonth, currentYear);
  const deletePayment = useDeletePayment();

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja eliminar este pagamento?')) {
      try {
        await deletePayment.mutateAsync(id);
      } catch (error) {
        alert('Erro ao eliminar pagamento');
      }
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.client?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    const matchesMonth = !monthFilter || payment.period === monthFilter;
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success border-success/20';
      case 'overdue':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'cancelled':
        return 'bg-muted/50 text-muted-foreground border-border';
      default:
        return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'overdue':
        return 'Em Atraso';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getMethodLabel = (method?: string) => {
    switch (method) {
      case 'mbway':
        return 'MB Way';
      case 'transfer':
        return 'Transferência';
      case 'cash':
        return 'Numerário';
      case 'card':
        return 'Cartão';
      case 'other':
        return 'Outro';
      default:
        return '-';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 shadow-sm">
                <CreditCard className="h-6 w-6 text-success" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Gestão de Pagamentos</h1>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? 'A carregar...' : `${payments.length} pagamentos registados`}
                </p>
              </div>
            </div>
            <Button 
              className="gap-2"
              onClick={() => {
                setEditingPayment(null);
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Novo Pagamento
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] p-6 pb-12">
        {/* Resumo */}
        {summary && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Recebido</p>
                <p className="mt-2 text-2xl font-bold text-success">{formatCurrency(summary.totalReceived)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{summary.countReceived} pagamentos</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Pendente</p>
                <p className="mt-2 text-2xl font-bold text-warning">{formatCurrency(summary.totalPending)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{summary.countPending} pagamentos</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total em Atraso</p>
                <p className="mt-2 text-2xl font-bold text-destructive">{formatCurrency(summary.totalOverdue)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Requer atenção</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Taxa de Recebimento</p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.countReceived + summary.countPending > 0
                    ? Math.round((summary.countReceived / (summary.countReceived + summary.countPending)) * 100)
                    : 0}%
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Do total esperado</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Esperado</p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {formatCurrency(summary.totalReceived + summary.totalPending + summary.totalOverdue)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Mês atual</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Pesquisar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 rounded-lg border border-border bg-background px-3 py-1.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Todos os estados</option>
                  <option value="paid">Pago</option>
                  <option value="pending">Pendente</option>
                  <option value="overdue">Em Atraso</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="month"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {(searchTerm || statusFilter || monthFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    setMonthFilter('');
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Pagamentos */}
        <Card>
          <CardHeader
            title="Pagamentos"
            subtitle={`${filteredPayments.length} ${filteredPayments.length === 1 ? 'pagamento' : 'pagamentos'}`}
            icon={
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                <CreditCard className="h-4 w-4 text-success" strokeWidth={2.5} />
              </div>
            }
          />
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-muted/20" />
                ))}
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {searchTerm || statusFilter || monthFilter
                    ? 'Nenhum pagamento encontrado com os filtros aplicados'
                    : 'Nenhum pagamento registado'}
                </p>
                <Button 
                  className="mt-4 gap-2"
                  onClick={() => setShowForm(true)}
                >
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Pagamento
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3">Cliente</th>
                      <th className="pb-3">Serviço</th>
                      <th className="pb-3">Valor</th>
                      <th className="pb-3">Período</th>
                      <th className="pb-3">Vencimento</th>
                      <th className="pb-3">Pagamento</th>
                      <th className="pb-3">Método</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                        <td className="py-3">
                          <p className="font-medium">{payment.client?.name || '-'}</p>
                          <p className="text-xs text-muted-foreground">{payment.client?.email}</p>
                        </td>
                        <td className="py-3 text-sm">{payment.service?.name || '-'}</td>
                        <td className="py-3">
                          <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                        </td>
                        <td className="py-3 text-sm">{payment.period || '-'}</td>
                        <td className="py-3 text-sm">
                          {new Date(payment.dueDate).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="py-3 text-sm">
                          {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('pt-PT') : '-'}
                        </td>
                        <td className="py-3 text-sm">{getMethodLabel(payment.method)}</td>
                        <td className="py-3">
                          <span className={cn(
                            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                            getStatusColor(payment.status)
                          )}>
                            {payment.status === 'paid' && <CheckCircle2 className="h-3 w-3" />}
                            {getStatusLabel(payment.status)}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleEdit(payment)}
                              className="rounded p-1.5 text-primary transition-colors hover:bg-primary/10"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(payment.id)}
                              className="rounded p-1.5 text-destructive transition-colors hover:bg-destructive/10"
                              title="Eliminar"
                            >
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

      {/* Modal de Formulário */}
      {showForm && (
        <PaymentForm
          payment={editingPayment || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingPayment(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingPayment(null);
          }}
        />
      )}
    </div>
  );
}
