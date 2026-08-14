import { useState } from 'react';
import { Dumbbell, Plus, Edit2, Trash2, Clock, Euro } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useServices, useDeleteService, useToggleServiceStatus } from '@/hooks/useServices';
import { ServiceForm } from '@/components/forms/ServiceForm';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  billingType?: 'monthly' | 'per_session';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export function ServicosPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { data: services = [], isLoading } = useServices();
  const deleteService = useDeleteService();
  const toggleStatus = useToggleServiceStatus();

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja eliminar este serviço?')) {
      try {
        await deleteService.mutateAsync(id);
      } catch (error) {
        alert('Erro ao eliminar serviço');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus.mutateAsync(id);
    } catch (error) {
      alert('Erro ao alterar status');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shadow-sm">
                <Dumbbell className="h-6 w-6 text-primary" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Gestão de Serviços</h1>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? 'A carregar...' : `${services.length} serviços registados`}
                </p>
              </div>
            </div>
            <Button 
              className="gap-2"
              onClick={() => {
                setEditingService(null);
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Novo Serviço
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] p-6 pb-12">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-muted/20" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">Nenhum serviço registado</p>
              <Button 
                className="mt-4 gap-2"
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-4 w-4" />
                Criar Primeiro Serviço
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className={cn(
                "transition-all hover:shadow-lg",
                !service.active && "opacity-60"
              )}>
                <CardHeader
                  title={service.name}
                  subtitle={service.active ? 'Ativo' : 'Inativo'}
                  icon={
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      service.active ? "bg-primary/10" : "bg-muted"
                    )}>
                      <Dumbbell className={cn(
                        "h-4 w-4",
                        service.active ? "text-primary" : "text-muted-foreground"
                      )} strokeWidth={2.5} />
                    </div>
                  }
                />
                <CardContent>
                  {/* Descrição */}
                  {service.description && (
                    <p className="mb-4 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  )}

                  {/* Preço e Duração */}
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border/50 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Euro className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium uppercase tracking-wider">Preço</span>
                      </div>
                      <p className="mt-1 text-xl font-bold">€{service.price.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.billingType === 'per_session' ? 'por sessão' : 'por mês'}
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium uppercase tracking-wider">Duração</span>
                      </div>
                      <p className="mt-1 text-xl font-bold">{service.duration}</p>
                      <p className="text-xs text-muted-foreground">minutos</p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      className="flex-1 gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(service.id)}
                      className="gap-2"
                    >
                      {service.active ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      className="gap-2 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Formulário */}
      {showForm && (
        <ServiceForm
          service={editingService || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingService(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingService(null);
          }}
        />
      )}
    </div>
  );
}
