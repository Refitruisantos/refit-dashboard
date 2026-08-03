import { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  CreditCard, 
  Edit2,
  FileText, 
  Mail, 
  MapPin, 
  Phone, 
  Plus, 
  Search, 
  Target, 
  Trash2,
  TrendingUp, 
  User, 
  Users 
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { useClients, useDeleteClient, useToggleClientStatus } from '@/hooks/useClients';
import { ClientForm } from '@/components/forms/ClientForm';
import type { Client } from '@/types/client';

export function ClientesPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Usar API real
  const { data: clients = [], isLoading, error } = useClients({ search: searchTerm });
  const deleteClient = useDeleteClient();
  const toggleStatus = useToggleClientStatus();
  
  // Selecionar primeiro cliente se nenhum estiver selecionado
  if (!selectedClient && clients.length > 0 && !isLoading) {
    setSelectedClient(clients[0]);
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja eliminar este cliente?')) {
      try {
        await deleteClient.mutateAsync(id);
        if (selectedClient?.id === id) {
          setSelectedClient(filteredClients[0] || null);
        }
      } catch (error) {
        alert('Erro ao eliminar cliente');
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

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shadow-sm">
                <Users className="h-6 w-6 text-primary" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Gestão de Clientes</h1>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? 'A carregar...' : `${clients.length} clientes registados`}
                </p>
              </div>
            </div>
            <Button 
              className="gap-2"
              onClick={() => {
                setEditingClient(null);
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] p-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          {/* Lista de Clientes */}
          <Card>
            <CardHeader
              title="Clientes"
              subtitle={`${filteredClients.length} encontrados`}
              icon={
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
                  <Users className="h-4 w-4 text-chart-2" strokeWidth={2.5} />
                </div>
              }
            />
            <CardContent>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Pesquisar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-background py-2 pl-10 pr-4 text-sm focus:border-border focus:outline-none focus:ring-2 focus:ring-success/20"
                />
              </div>

              {/* Client List */}
              <div className="space-y-2">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={cn(
                      'w-full rounded-lg border p-3 text-left transition-all',
                      selectedClient?.id === client.id
                        ? 'border-success/50 bg-success/5 shadow-sm'
                        : 'border-border/50 hover:border-border hover:bg-muted/30'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-chart-2 to-chart-5 text-sm font-semibold text-white">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{client.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{client.plan}</p>
                      </div>
                      <div className={cn(
                        'h-2 w-2 rounded-full',
                        client.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
                      )} />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Cliente */}
          {selectedClient && (
            <div className="space-y-6">
              {/* Dados Pessoais */}
              <Card>
                <CardHeader
                  title="Dados Pessoais"
                  subtitle={selectedClient.status === 'active' ? 'Cliente Ativo' : 'Cliente Inativo'}
                  icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
                      <User className="h-4 w-4 text-chart-2" strokeWidth={2.5} />
                    </div>
                  }
                />
                <CardContent>
                  {/* Botões de Ação */}
                  <div className="mb-6 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(selectedClient)}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(selectedClient.id)}
                      className="gap-2"
                    >
                      {selectedClient.status === 'active' ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(selectedClient.id)}
                      className="gap-2 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                  
                  {/* Dados */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Nome Completo</label>
                        <p className="mt-1 text-sm font-semibold">{selectedClient.name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          {selectedClient.email}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Telefone</label>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {selectedClient.phone}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Data de Nascimento</label>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(selectedClient.birthDate).toLocaleDateString('pt-PT')}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Morada</label>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          {selectedClient.address}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Membro Desde</label>
                        <p className="mt-1 text-sm">{new Date(selectedClient.joinDate).toLocaleDateString('pt-PT')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plano e Mensalidade */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader
                    title="Plano Contratado"
                    icon={
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
                        <TrendingUp className="h-4 w-4 text-chart-1" strokeWidth={2.5} />
                      </div>
                    }
                  />
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedClient.plan}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Plano ativo</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader
                    title="Mensalidade"
                    icon={
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
                        <CreditCard className="h-4 w-4 text-chart-3" strokeWidth={2.5} />
                      </div>
                    }
                  />
                  <CardContent>
                    <p className="text-2xl font-bold">{formatCurrency(selectedClient.monthlyFee)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Por mês</p>
                  </CardContent>
                </Card>
              </div>

              {/* Histórico de Pagamentos */}
              <Card>
                <CardHeader
                  title="Histórico de Pagamentos"
                  subtitle={`${selectedClient.paymentHistory?.length || 0} pagamentos`}
                  icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
                      <CreditCard className="h-4 w-4 text-chart-3" strokeWidth={2.5} />
                    </div>
                  }
                />
                <CardContent>
                  <div className="space-y-3">
                    {(selectedClient.paymentHistory || []).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg',
                            payment.status === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                          )}>
                            <CreditCard className="h-4 w-4" strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{payment.description}</p>
                            <p className="text-xs text-muted-foreground">{new Date(payment.date).toLocaleDateString('pt-PT')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{formatCurrency(payment.amount)}</p>
                          <p className={cn(
                            'text-xs font-medium',
                            payment.status === 'paid' ? 'text-success' : 'text-warning'
                          )}>
                            {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Histórico de Avaliações */}
              <Card>
                <CardHeader
                  title="Histórico de Avaliações"
                  subtitle={`${selectedClient.assessmentHistory?.length || 0} avaliações`}
                  icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-5/10">
                      <TrendingUp className="h-4 w-4 text-chart-5" strokeWidth={2.5} />
                    </div>
                  }
                />
                <CardContent>
                  <div className="space-y-3">
                    {(selectedClient.assessmentHistory || []).map((assessment) => (
                      <div key={assessment.id} className="rounded-lg border border-border/50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold">{new Date(assessment.date).toLocaleDateString('pt-PT')}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Peso</p>
                            <p className="text-lg font-bold">{assessment.weight}kg</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Gordura</p>
                            <p className="text-lg font-bold">{assessment.bodyFat}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Massa Muscular</p>
                            <p className="text-lg font-bold">{assessment.muscleMass}kg</p>
                          </div>
                        </div>
                        {assessment.notes && (
                          <p className="mt-3 text-xs text-muted-foreground">{assessment.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Objetivos */}
              <Card>
                <CardHeader
                  title="Objetivos"
                  subtitle={`${selectedClient.goals?.length || 0} objetivos definidos`}
                  icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10">
                      <Target className="h-4 w-4 text-chart-4" strokeWidth={2.5} />
                    </div>
                  }
                />
                <CardContent>
                  <div className="space-y-3">
                    {(selectedClient.goals || []).map((goal) => (
                      <div key={goal.id} className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
                        <div className={cn(
                          'mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg',
                          goal.status === 'completed' ? 'bg-success/10 text-success' : 'bg-chart-4/10 text-chart-4'
                        )}>
                          {goal.status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                          ) : (
                            <Target className="h-4 w-4" strokeWidth={2.5} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{goal.title}</p>
                          <p className="text-xs text-muted-foreground">Meta: {goal.target}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Prazo: {new Date(goal.deadline).toLocaleDateString('pt-PT')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Observações */}
              <Card>
                <CardHeader
                  title="Observações"
                  icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-6/10">
                      <FileText className="h-4 w-4 text-chart-6" strokeWidth={2.5} />
                    </div>
                  }
                />
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{selectedClient.notes}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Formulário */}
      {showForm && (
        <ClientForm
          client={editingClient || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingClient(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingClient(null);
          }}
        />
      )}
    </div>
  );
}
