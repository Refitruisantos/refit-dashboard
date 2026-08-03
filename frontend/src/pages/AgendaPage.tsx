import { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, Copy, Sparkles, Dumbbell } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppointments, useDeleteAppointment } from '@/hooks/useAppointments';
import { useEvents, useDeleteEvent, useDuplicateEvent } from '@/hooks/useEvents';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { EventForm } from '@/components/forms/EventForm';
import { cn } from '@/lib/utils';

type TabType = 'appointments' | 'events';

export function AgendaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('appointments');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const { data: appointments = [], isLoading: loadingAppointments } = useAppointments();
  const { data: events = [], isLoading: loadingEvents } = useEvents();
  const deleteAppointment = useDeleteAppointment();
  const deleteEvent = useDeleteEvent();
  const duplicateEvent = useDuplicateEvent();

  const handleDeleteAppointment = async (id: string) => {
    if (confirm('Eliminar este treino?')) {
      try {
        await deleteAppointment.mutateAsync(id);
      } catch (error) {
        alert('Erro ao eliminar treino');
      }
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Eliminar este evento?')) {
      try {
        await deleteEvent.mutateAsync(id);
      } catch (error) {
        alert('Erro ao eliminar evento');
      }
    }
  };

  const handleDuplicateEvent = async (id: string) => {
    try {
      await duplicateEvent.mutateAsync(id);
    } catch (error) {
      alert('Erro ao duplicar evento');
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'confirmed': return 'bg-primary/10 text-primary border-primary/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'no-show': return 'bg-muted/50 text-muted-foreground border-border';
      default: return 'bg-warning/10 text-warning border-warning/20';
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'confirmed': return 'bg-primary/10 text-primary border-primary/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'planned': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const getStatusLabel = (status: string, type: 'appointment' | 'event') => {
    if (type === 'appointment') {
      const labels: Record<string, string> = {
        scheduled: 'Agendado',
        confirmed: 'Confirmado',
        completed: 'Concluído',
        cancelled: 'Cancelado',
        'no-show': 'Faltou',
      };
      return labels[status] || status;
    } else {
      const labels: Record<string, string> = {
        idea: 'Ideia',
        planned: 'Planeado',
        confirmed: 'Confirmado',
        completed: 'Realizado',
        cancelled: 'Cancelado',
      };
      return labels[status] || status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shadow-sm">
                <Calendar className="h-6 w-6 text-primary" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Agenda REFIT</h1>
                <p className="text-sm text-muted-foreground">
                  Treinos e Eventos
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] p-6 pb-12">
        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('appointments')}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
              activeTab === 'appointments'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Dumbbell className="h-4 w-4" />
            Agenda de Treinos
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
              activeTab === 'events'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Sparkles className="h-4 w-4" />
            Planeamento REFIT
          </button>
        </div>

        {/* Agenda de Treinos */}
        {activeTab === 'appointments' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Treinos Agendados</h2>
              <Button onClick={() => { setEditingAppointment(null); setShowAppointmentForm(true); }} className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Treino
              </Button>
            </div>

            <Card>
              <CardHeader
                title="Treinos"
                subtitle={`${appointments.length} ${appointments.length === 1 ? 'treino' : 'treinos'}`}
                icon={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Dumbbell className="h-4 w-4 text-primary" strokeWidth={2.5} />
                  </div>
                }
              />
              <CardContent>
                {loadingAppointments ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 animate-pulse rounded-lg bg-muted/20" />)}
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Dumbbell className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-sm text-muted-foreground">Nenhum treino agendado</p>
                    <Button onClick={() => setShowAppointmentForm(true)} className="mt-4 gap-2">
                      <Plus className="h-4 w-4" />
                      Agendar Primeiro Treino
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((apt: any) => (
                      <div key={apt.id} className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/30">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold">{apt.client?.name || 'Cliente'}</p>
                            <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', getAppointmentStatusColor(apt.status))}>
                              {getStatusLabel(apt.status, 'appointment')}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {apt.service?.name} • {new Date(apt.date).toLocaleDateString('pt-PT')} às {apt.startTime} • {apt.duration}min
                          </p>
                          {apt.trainerId && <p className="mt-1 text-xs text-muted-foreground">Treinador: {apt.trainerId}</p>}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingAppointment(apt); setShowAppointmentForm(true); }}
                            className="rounded p-1.5 text-primary transition-colors hover:bg-primary/10" title="Editar">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteAppointment(apt.id)}
                            className="rounded p-1.5 text-destructive transition-colors hover:bg-destructive/10" title="Eliminar">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Planeamento REFIT */}
        {activeTab === 'events' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Eventos e Atividades REFIT</h2>
              <Button onClick={() => { setEditingEvent(null); setShowEventForm(true); }} className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Evento
              </Button>
            </div>

            <Card>
              <CardHeader
                title="Eventos"
                subtitle={`${events.length} ${events.length === 1 ? 'evento' : 'eventos'}`}
                icon={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" strokeWidth={2.5} />
                  </div>
                }
              />
              <CardContent>
                {loadingEvents ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 animate-pulse rounded-lg bg-muted/20" />)}
                  </div>
                ) : events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-sm text-muted-foreground">Nenhum evento planeado</p>
                    <Button onClick={() => setShowEventForm(true)} className="mt-4 gap-2">
                      <Plus className="h-4 w-4" />
                      Criar Primeiro Evento
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {events.map((evt: any) => (
                      <div key={evt.id} className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/30">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <p className="font-bold">{evt.name}</p>
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{evt.category}</span>
                              <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', getEventStatusColor(evt.status))}>
                                {getStatusLabel(evt.status, 'event')}
                              </span>
                            </div>
                            {evt.description && <p className="mt-2 text-sm text-muted-foreground">{evt.description}</p>}
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              <span>📅 {new Date(evt.startDate).toLocaleDateString('pt-PT')}</span>
                              {evt.startTime && <span>🕐 {evt.startTime}</span>}
                              {evt.location && <span>📍 {evt.location}</span>}
                              {evt.responsible && <span>👤 {evt.responsible}</span>}
                              {evt.budgetPlanned && <span>💰 €{evt.budgetPlanned}</span>}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => handleDuplicateEvent(evt.id)}
                              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Duplicar">
                              <Copy className="h-4 w-4" />
                            </button>
                            <button onClick={() => { setEditingEvent(evt); setShowEventForm(true); }}
                              className="rounded p-1.5 text-primary transition-colors hover:bg-primary/10" title="Editar">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteEvent(evt.id)}
                              className="rounded p-1.5 text-destructive transition-colors hover:bg-destructive/10" title="Eliminar">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Modals */}
      {showAppointmentForm && (
        <AppointmentForm
          appointment={editingAppointment || undefined}
          onClose={() => { setShowAppointmentForm(false); setEditingAppointment(null); }}
          onSuccess={() => { setShowAppointmentForm(false); setEditingAppointment(null); }}
        />
      )}

      {showEventForm && (
        <EventForm
          event={editingEvent || undefined}
          onClose={() => { setShowEventForm(false); setEditingEvent(null); }}
          onSuccess={() => { setShowEventForm(false); setEditingEvent(null); }}
        />
      )}
    </div>
  );
}
