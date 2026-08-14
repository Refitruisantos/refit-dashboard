import { useState } from 'react';
import { X, Dumbbell } from 'lucide-react';
import { useCreateService, useUpdateService } from '@/hooks/useServices';

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  billingType?: 'monthly' | 'per_session';
  active: boolean;
}

interface ServiceFormProps {
  service?: Service;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ServiceForm({ service, onClose, onSuccess }: ServiceFormProps) {
  const isEditing = !!service;
  const createService = useCreateService();
  const updateService = useUpdateService();

  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || 0,
    duration: service?.duration || 60,
    billingType: service?.billingType || 'monthly' as 'monthly' | 'per_session',
    active: service?.active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? parseFloat(value) || 0 : 
                       type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                       value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Duração deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isEditing) {
        await updateService.mutateAsync({
          id: service.id,
          data: formData,
        });
      } else {
        await createService.mutateAsync(formData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
      setErrors({ submit: (error as Error).message });
    }
  };

  const isLoading = createService.isPending || updateService.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-navy-900 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Dumbbell className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold text-white">
              {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
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
          <div className="space-y-3">
            {/* Nome */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nome do Serviço <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
                placeholder="Ex: Pilates, Hybrid, Treino Personalizado"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Descrição */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="Descrição do serviço..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
            </div>

            {/* Tipo de Cobrança */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tipo de Cobrança <span className="text-red-400">*</span>
              </label>
              <select
                name="billingType"
                value={formData.billingType}
                onChange={(e) => setFormData(prev => ({ ...prev, billingType: e.target.value as 'monthly' | 'per_session' }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              >
                <option value="monthly">Mensal (valor fixo por mês)</option>
                <option value="per_session">Por Sessão (valor por cada treino)</option>
              </select>
            </div>

            {/* Preço e Duração */}
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {formData.billingType === 'monthly' ? 'Preço Mensal (€)' : 'Preço por Sessão (€)'} <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                  placeholder="15.00"
                />
                {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Duração (min) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                  placeholder="60"
                />
                {errors.duration && <p className="mt-1 text-xs text-red-400">{errors.duration}</p>}
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</label>
              <select
                name="active"
                value={formData.active ? 'true' : 'false'}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.value === 'true' }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-2.5 text-xs text-red-400">
                {errors.submit}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
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
              {isLoading ? 'A guardar...' : isEditing ? 'Atualizar Serviço' : 'Criar Serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
