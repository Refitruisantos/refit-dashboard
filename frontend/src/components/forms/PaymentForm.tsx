import { useState, useEffect } from 'react';
import { X, CreditCard } from 'lucide-react';
import { useCreatePayment, useUpdatePayment } from '@/hooks/usePayments';
import { useClients } from '@/hooks/useClients';
import { useServices } from '@/hooks/useServices';

interface Payment {
  id: string;
  clientId: string;
  serviceId?: string;
  amount: number;
  period?: string;
  dueDate: string;
  paidAt?: string;
  method?: 'mbway' | 'transfer' | 'cash' | 'card' | 'other';
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  notes?: string;
}

interface PaymentFormProps {
  payment?: Payment;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PaymentForm({ payment, onClose, onSuccess }: PaymentFormProps) {
  const isEditing = !!payment;
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const { data: clients = [] } = useClients();
  const { data: services = [] } = useServices({ active: true });

  // Calcular data de vencimento automática (dia 8 do mês)
  const calculateDueDate = (period: string) => {
    if (!period) return '';
    const [year, month] = period.split('-').map(Number);
    return `${year}-${String(month).padStart(2, '0')}-08`;
  };

  const [formData, setFormData] = useState({
    clientId: payment?.clientId || '',
    serviceId: payment?.serviceId || '',
    amount: payment?.amount || 0,
    period: payment?.period || '',
    dueDate: payment?.dueDate ? new Date(payment.dueDate).toISOString().split('T')[0] : calculateDueDate(payment?.period || ''),
    paidAt: payment?.paidAt ? new Date(payment.paidAt).toISOString().split('T')[0] : '',
    method: payment?.method || '' as '' | 'mbway' | 'transfer' | 'cash' | 'card' | 'other',
    status: payment?.status || 'pending' as 'paid' | 'pending' | 'overdue' | 'cancelled',
    notes: payment?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-preencher serviço e valor quando cliente é selecionado
  useEffect(() => {
    // Temporariamente desativado - subscriptions não está no tipo Client
    // if (formData.clientId && !isEditing) {
    //   const selectedClient = clients.find(c => c.id === formData.clientId);
    //   if (selectedClient?.subscriptions && selectedClient.subscriptions.length > 0) {
    //     const activeSubscription = selectedClient.subscriptions.find(s => s.status === 'active');
    //     if (activeSubscription) {
    //       setFormData(prev => ({
    //         ...prev,
    //         serviceId: activeSubscription.serviceId,
    //         amount: activeSubscription.price,
    //       }));
    //     }
    //   }
    // }
  }, [formData.clientId, clients, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'amount' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Cliente é obrigatório';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    // Data de vencimento é calculada automaticamente (dia 8 do mês)
    if (!formData.period) {
      newErrors.period = 'Período é obrigatório para calcular data de vencimento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const dataToSubmit = {
        ...formData,
        serviceId: formData.serviceId || undefined,
        period: formData.period || undefined,
        paidAt: formData.paidAt || undefined,
        method: formData.method || undefined,
        notes: formData.notes || undefined,
      };

      if (isEditing) {
        await updatePayment.mutateAsync({
          id: payment.id,
          data: dataToSubmit,
        });
      } else {
        await createPayment.mutateAsync(dataToSubmit);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving payment:', error);
      setErrors({ submit: (error as Error).message });
    }
  };

  const isLoading = createPayment.isPending || updatePayment.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-navy-900 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <CreditCard className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold text-white">
              {isEditing ? 'Editar Pagamento' : 'Novo Pagamento'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Cliente e Serviço */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cliente <span className="text-destructive">*</span>
                </label>
                <select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading || isEditing}
                >
                  <option value="">Selecionar cliente...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {errors.clientId && <p className="mt-1 text-xs text-destructive">{errors.clientId}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Serviço
                </label>
                <select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                >
                  <option value="">Nenhum</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Valor e Período */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Valor (€) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                  placeholder="0.00"
                />
                {errors.amount && <p className="mt-1 text-xs text-destructive">{errors.amount}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Período <span className="text-destructive">*</span>
                </label>
                <input
                  type="month"
                  name="period"
                  value={formData.period}
                  onChange={(e) => {
                    handleChange(e);
                    // Atualizar data de vencimento automaticamente
                    const newDueDate = calculateDueDate(e.target.value);
                    setFormData(prev => ({ ...prev, dueDate: newDueDate }));
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
                {errors.period && <p className="mt-1 text-xs text-destructive">{errors.period}</p>}
              </div>
            </div>

            {/* Data de Vencimento (automática) e Data de Pagamento */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Data de Vencimento (automática)
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground transition-all bg-muted-50 cursor-not-allowed"
                  disabled={true}
                />
                <p className="mt-1 text-xs text-muted-foreground">Calculada automaticamente: dia 8 do mês selecionado</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Data de Pagamento
                </label>
                <input
                  type="date"
                  name="paidAt"
                  value={formData.paidAt}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Método de Pagamento e Estado */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Método de Pagamento
                </label>
                <select
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                >
                  <option value="">Selecionar...</option>
                  <option value="mbway">MB Way</option>
                  <option value="transfer">Transferência Bancária</option>
                  <option value="cash">Numerário</option>
                  <option value="card">Cartão</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                >
                  <option value="paid">Pago</option>
                  <option value="pending">Pendente</option>
                  <option value="overdue">Em Atraso</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Observações
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Notas sobre o pagamento..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-2.5 text-xs text-destructive">
                {errors.submit}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50"
            >
              {isLoading ? 'A guardar...' : isEditing ? 'Atualizar Pagamento' : 'Criar Pagamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
