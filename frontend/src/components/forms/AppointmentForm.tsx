import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useCreateAppointment, useUpdateAppointment } from '@/hooks/useAppointments';
import { useClients } from '@/hooks/useClients';
import { useServices } from '@/hooks/useServices';

interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  trainerId?: string;
  date: string;
  startTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

interface AppointmentFormProps {
  appointment?: Appointment;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AppointmentForm({ appointment, onClose, onSuccess }: AppointmentFormProps) {
  const isEditing = !!appointment;
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const { data: clients = [] } = useClients();
  const { data: services = [] } = useServices({ active: true });

  const [formData, setFormData] = useState({
    clientId: appointment?.clientId || '',
    serviceId: appointment?.serviceId || '',
    trainerId: appointment?.trainerId || '',
    date: appointment?.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
    startTime: appointment?.startTime || '',
    duration: appointment?.duration || 60,
    status: appointment?.status || 'scheduled' as 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show',
    notes: appointment?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'duration' ? parseInt(value) || 60 : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) newErrors.clientId = 'Cliente é obrigatório';
    if (!formData.serviceId) newErrors.serviceId = 'Serviço é obrigatório';
    if (!formData.date) newErrors.date = 'Data é obrigatória';
    if (!formData.startTime) newErrors.startTime = 'Hora é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const dataToSubmit = {
        ...formData,
        trainerId: formData.trainerId || undefined,
        notes: formData.notes || undefined,
      };

      if (isEditing) {
        await updateAppointment.mutateAsync({ id: appointment.id, data: dataToSubmit });
      } else {
        await createAppointment.mutateAsync(dataToSubmit);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
      setErrors({ submit: (error as Error).message });
    }
  };

  const isLoading = createAppointment.isPending || updateAppointment.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-navy-900 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Calendar className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold text-white">
              {isEditing ? 'Editar Treino' : 'Novo Treino'}
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
                  Cliente <span className="text-destructive">*</span>
                </label>
                <select name="clientId" value={formData.clientId} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}>
                  <option value="">Selecionar...</option>
                  {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
                </select>
                {errors.clientId && <p className="mt-1 text-xs text-destructive">{errors.clientId}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Serviço <span className="text-destructive">*</span>
                </label>
                <select name="serviceId" value={formData.serviceId} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}>
                  <option value="">Selecionar...</option>
                  {services.map(service => <option key={service.id} value={service.id}>{service.name}</option>)}
                </select>
                {errors.serviceId && <p className="mt-1 text-xs text-destructive">{errors.serviceId}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Personal Trainer</label>
              <input type="text" name="trainerId" value={formData.trainerId} onChange={handleChange} placeholder="Nome do treinador..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Data <span className="text-destructive">*</span>
                </label>
                <input type="date" name="date" value={formData.date} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
                {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Hora <span className="text-destructive">*</span>
                </label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
                {errors.startTime && <p className="mt-1 text-xs text-destructive">{errors.startTime}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duração (min)</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="15" step="15"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading} />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}>
                <option value="scheduled">Agendado</option>
                <option value="confirmed">Confirmado</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
                <option value="no-show">Faltou</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Observações</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Notas sobre o treino..."
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
              {isLoading ? 'A guardar...' : isEditing ? 'Atualizar' : 'Criar Treino'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
