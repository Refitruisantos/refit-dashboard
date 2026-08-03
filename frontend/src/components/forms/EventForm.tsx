import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useCreateEvent, useUpdateEvent } from '@/hooks/useEvents';

interface Event {
  id: string;
  name: string;
  category: string;
  description?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  location?: string;
  responsible?: string;
  participants?: string;
  budgetPlanned?: number;
  budgetActual?: number;
  status: 'idea' | 'planned' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

interface EventFormProps {
  event?: Event;
  onClose: () => void;
  onSuccess?: () => void;
}

const categories = [
  'Workshop',
  'Caminhada',
  'Jantar',
  'Desafio',
  'Evento com Clientes',
  'Campanha',
  'Marketing',
  'Formação',
  'Reunião',
  'Aniversário',
  'Avaliação Especial',
  'Outro',
];

export function EventForm({ event, onClose, onSuccess }: EventFormProps) {
  const isEditing = !!event;
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const [formData, setFormData] = useState({
    name: event?.name || '',
    category: event?.category || '',
    description: event?.description || '',
    startDate: event?.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
    endDate: event?.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
    startTime: event?.startTime || '',
    location: event?.location || '',
    responsible: event?.responsible || '',
    participants: event?.participants || '',
    budgetPlanned: event?.budgetPlanned || 0,
    budgetActual: event?.budgetActual || 0,
    status: event?.status || 'idea' as 'idea' | 'planned' | 'confirmed' | 'completed' | 'cancelled',
    notes: event?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const finalValue = (name === 'budgetPlanned' || name === 'budgetActual') ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.category) newErrors.category = 'Categoria é obrigatória';
    if (!formData.startDate) newErrors.startDate = 'Data de início é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const dataToSubmit = {
        ...formData,
        endDate: formData.endDate || undefined,
        startTime: formData.startTime || undefined,
        location: formData.location || undefined,
        responsible: formData.responsible || undefined,
        participants: formData.participants || undefined,
        budgetPlanned: formData.budgetPlanned || undefined,
        budgetActual: formData.budgetActual || undefined,
        description: formData.description || undefined,
        notes: formData.notes || undefined,
      };

      if (isEditing) {
        await updateEvent.mutateAsync({ id: event.id, data: dataToSubmit });
      } else {
        await createEvent.mutateAsync(dataToSubmit);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      setErrors({ submit: (error as Error).message });
    }
  };

  const isLoading = createEvent.isPending || updateEvent.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-navy-900 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold text-white">
              {isEditing ? 'Editar Evento' : 'Novo Evento REFIT'}
            </h2>
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
                  Nome do Evento <span className="text-destructive">*</span>
                </label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Workshop de Nutrição"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
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

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descrição</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={2} placeholder="Descrição do evento..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Data Início <span className="text-destructive">*</span>
                </label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
                {errors.startDate && <p className="mt-1 text-xs text-destructive">{errors.startDate}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data Fim</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hora</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Local</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Local do evento..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Responsável</label>
                <input type="text" name="responsible" value={formData.responsible} onChange={handleChange} placeholder="Nome do responsável..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Participantes/Clientes</label>
              <input type="text" name="participants" value={formData.participants} onChange={handleChange} placeholder="Lista de participantes..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Orçamento Previsto (€)</label>
                <input type="number" name="budgetPlanned" value={formData.budgetPlanned} onChange={handleChange} step="0.01" min="0"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Custo Real (€)</label>
                <input type="number" name="budgetActual" value={formData.budgetActual} onChange={handleChange} step="0.01" min="0"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</label>
                <select name="status" value={formData.status} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}>
                  <option value="idea">Ideia</option>
                  <option value="planned">Planeado</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="completed">Realizado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Observações</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Notas sobre o evento..."
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
              {isLoading ? 'A guardar...' : isEditing ? 'Atualizar' : 'Criar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
