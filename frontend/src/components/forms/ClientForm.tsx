import { useState, useMemo } from 'react';
import { X, User } from 'lucide-react';
import { useCreateClient, useUpdateClient } from '@/hooks/useClients';
import { useServices } from '@/hooks/useServices';
import type { Client } from '@/types/client';

interface ClientFormProps {
  client?: Client;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ClientForm({ client, onClose, onSuccess }: ClientFormProps) {
  const isEditing = !!client;
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const { data: services = [] } = useServices({ active: true });

  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    birthDate: client?.birthDate ? new Date(client.birthDate).toISOString().split('T')[0] : '',
    address: client?.address || '',
    notes: client?.notes || '',
    status: client?.status || 'active',
    serviceId: '',
    weeklyFrequency: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calcular mensalidade estimada
  const estimatedMonthlyFee = useMemo(() => {
    if (!formData.serviceId || !formData.weeklyFrequency) return 0;
    const selectedService = services.find(s => s.id === formData.serviceId);
    if (!selectedService) return 0;
    
    // Se for cobrança mensal, retorna o preço fixo
    if (selectedService.billingType === 'monthly') {
      return selectedService.price;
    }
    
    // Se for por sessão, multiplica pela frequência semanal × 4 semanas
    return selectedService.price * formData.weeklyFrequency * 4;
  }, [formData.serviceId, formData.weeklyFrequency, services]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'weeklyFrequency' ? parseInt(value) || 1 : value;
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isEditing) {
        await updateClient.mutateAsync({
          id: client.id,
          data: formData,
        });
      } else {
        await createClient.mutateAsync(formData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
      setErrors({ submit: (error as Error).message });
    }
  };

  const isLoading = createClient.isPending || updateClient.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-navy-900 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <User className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold text-white">
              {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
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
                Nome Completo <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
                placeholder="João Silva"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Email e Telefone */}
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                  placeholder="joao@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Telefone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+351 912 345 678"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Data Nascimento e Estado */}
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data Nascimento</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>

            {/* Serviço e Frequência Semanal */}
            {!isEditing && (
              <>
                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Plano de Treino</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Serviço</label>
                    <select
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      disabled={isLoading}
                    >
                      <option value="">Selecionar serviço...</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} - €{service.price}/{service.billingType === 'monthly' ? 'mês' : 'sessão'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequência Semanal</label>
                    <select
                      name="weeklyFrequency"
                      value={formData.weeklyFrequency}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      disabled={isLoading || !formData.serviceId}
                    >
                      <option value="1">1x por semana</option>
                      <option value="2">2x por semana</option>
                      <option value="3">3x por semana</option>
                      <option value="4">4x por semana</option>
                      <option value="5">5x por semana</option>
                      <option value="6">6x por semana</option>
                      <option value="7">7x por semana</option>
                    </select>
                  </div>
                </div>

                {/* Mensalidade Estimada */}
                {formData.serviceId && estimatedMonthlyFee > 0 && (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <p className="text-xs font-medium text-primary">Mensalidade Estimada</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">€{estimatedMonthlyFee.toFixed(2)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {services.find(s => s.id === formData.serviceId)?.billingType === 'monthly' 
                        ? 'Valor fixo mensal'
                        : `${formData.weeklyFrequency}x por semana × 4 semanas`}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Morada */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Morada</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Rua, Número, Cidade"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
            </div>

            {/* Observações */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Observações</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Notas sobre o cliente..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
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
              {isLoading ? 'A guardar...' : isEditing ? 'Atualizar Cliente' : 'Criar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
