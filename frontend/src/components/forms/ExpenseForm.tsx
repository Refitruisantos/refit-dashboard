import { useState } from 'react';
import { X, Receipt } from 'lucide-react';
import { useCreateExpense, useUpdateExpense } from '@/hooks/useExpenses';

interface Expense {
  id: string;
  description: string;
  category: string;
  supplier?: string;
  amount: number;
  expenseDate: string;
  dueDate: string;
  paidAt?: string;
  method?: 'mbway' | 'transfer' | 'cash' | 'card' | 'debit' | 'other';
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  type: 'fixed' | 'variable' | 'extraordinary';
  recurrence: 'once' | 'monthly' | 'quarterly' | 'biannual' | 'annual';
  notes?: string;
}

interface ExpenseFormProps {
  expense?: Expense;
  onClose: () => void;
  onSuccess?: () => void;
}

const categories = [
  'Renda', 'Água', 'Eletricidade', 'Internet/Telecomunicações', 'Salários',
  'Segurança Social', 'Seguros', 'Contabilidade', 'Software', 'Equipamento',
  'Manutenção', 'Limpeza', 'Marketing/Publicidade', 'Formação', 'Impostos',
  'Comissões Bancárias', 'Outros'
];

export function ExpenseForm({ expense, onClose, onSuccess }: ExpenseFormProps) {
  const isEditing = !!expense;
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const [formData, setFormData] = useState({
    description: expense?.description || '',
    category: expense?.category || '',
    supplier: expense?.supplier || '',
    amount: expense?.amount || 0,
    expenseDate: expense?.expenseDate ? new Date(expense.expenseDate).toISOString().split('T')[0] : '',
    dueDate: expense?.dueDate ? new Date(expense.dueDate).toISOString().split('T')[0] : '',
    paidAt: expense?.paidAt ? new Date(expense.paidAt).toISOString().split('T')[0] : '',
    method: expense?.method || '' as '' | 'mbway' | 'transfer' | 'cash' | 'card' | 'debit' | 'other',
    status: expense?.status || 'pending' as 'paid' | 'pending' | 'overdue' | 'cancelled',
    type: expense?.type || 'variable' as 'fixed' | 'variable' | 'extraordinary',
    recurrence: expense?.recurrence || 'once' as 'once' | 'monthly' | 'quarterly' | 'biannual' | 'annual',
    notes: expense?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'amount' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.category) newErrors.category = 'Categoria é obrigatória';
    if (formData.amount <= 0) newErrors.amount = 'Valor deve ser maior que zero';
    if (!formData.expenseDate) newErrors.expenseDate = 'Data da despesa é obrigatória';
    if (!formData.dueDate) newErrors.dueDate = 'Data de vencimento é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const dataToSubmit = {
        ...formData,
        supplier: formData.supplier || undefined,
        paidAt: formData.paidAt || undefined,
        method: formData.method || undefined,
        notes: formData.notes || undefined,
      };

      if (isEditing) {
        await updateExpense.mutateAsync({ id: expense.id, data: dataToSubmit });
      } else {
        await createExpense.mutateAsync(dataToSubmit);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      setErrors({ submit: (error as Error).message });
    }
  };

  const isLoading = createExpense.isPending || updateExpense.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-navy-900 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Receipt className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold text-white">{isEditing ? 'Editar Despesa' : 'Nova Despesa'}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white" disabled={isLoading}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Descrição <span className="text-destructive">*</span>
                </label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Ex: Renda Janeiro 2026"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
                {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Categoria <span className="text-destructive">*</span>
                </label>
                <select name="category" value={formData.category} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}>
                  <option value="">Selecionar...</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <p className="mt-1 text-xs text-destructive">{errors.category}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fornecedor/Entidade</label>
                <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} placeholder="Nome do fornecedor..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Valor (€) <span className="text-destructive">*</span>
                </label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} step="0.01" min="0" placeholder="0.00"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
                {errors.amount && <p className="mt-1 text-xs text-destructive">{errors.amount}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Data da Despesa <span className="text-destructive">*</span>
                </label>
                <input type="date" name="expenseDate" value={formData.expenseDate} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
                {errors.expenseDate && <p className="mt-1 text-xs text-destructive">{errors.expenseDate}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Data de Vencimento <span className="text-destructive">*</span>
                </label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
                {errors.dueDate && <p className="mt-1 text-xs text-destructive">{errors.dueDate}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data de Pagamento</label>
                <input type="date" name="paidAt" value={formData.paidAt} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Método de Pagamento</label>
                <select name="method" value={formData.method} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}>
                  <option value="">Selecionar...</option>
                  <option value="mbway">MB Way</option>
                  <option value="transfer">Transferência</option>
                  <option value="cash">Numerário</option>
                  <option value="card">Cartão</option>
                  <option value="debit">Débito Direto</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</label>
                <select name="status" value={formData.status} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}>
                  <option value="paid">Pago</option>
                  <option value="pending">Pendente</option>
                  <option value="overdue">Em Atraso</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</label>
                <select name="type" value={formData.type} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}>
                  <option value="fixed">Fixa</option>
                  <option value="variable">Variável</option>
                  <option value="extraordinary">Extraordinária</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recorrência</label>
                <select name="recurrence" value={formData.recurrence} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}>
                  <option value="once">Única</option>
                  <option value="monthly">Mensal</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="biannual">Semestral</option>
                  <option value="annual">Anual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Observações</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Notas sobre a despesa..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading} />
            </div>

            {errors.submit && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-2.5 text-xs text-destructive">{errors.submit}</div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={onClose} disabled={isLoading}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50">
              {isLoading ? 'A guardar...' : isEditing ? 'Atualizar' : 'Criar Despesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
