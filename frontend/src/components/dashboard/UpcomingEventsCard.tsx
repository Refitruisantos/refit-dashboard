import { Calendar, CreditCard, DollarSign, Receipt, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/states';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import type { UpcomingEvent } from '@/types/dashboard';

const EVENT_ICONS = {
  payment: CreditCard,
  expense: Receipt,
  renewal: RefreshCcw,
  session: DollarSign,
};

const EVENT_STYLES = {
  payment: 'bg-chart-1/10 text-chart-1',
  expense: 'bg-chart-4/10 text-chart-4',
  renewal: 'bg-chart-2/10 text-chart-2',
  session: 'bg-chart-5/10 text-chart-5',
};

export function UpcomingEventsCard({ events }: { events: UpcomingEvent[] }) {
  return (
    <Card>
      <CardHeader
        title="Próximas Datas"
        subtitle={`${events.length} eventos`}
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
            <Calendar className="h-4 w-4 text-chart-3" strokeWidth={2} />
          </div>
        }
      />
      <CardContent>
        {events.length === 0 ? (
          <EmptyState title="Sem eventos" message="Nenhum evento agendado para os próximos dias." />
        ) : (
          <ul className="scrollbar-thin max-h-[320px] space-y-2 overflow-y-auto pr-1">
            {events.map((event) => {
              const Icon = EVENT_ICONS[event.type];
              return (
                <li key={event.id} className="flex items-start gap-2.5 rounded-lg border border-border p-3">
                  <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', EVENT_STYLES[event.type])}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-tight">{event.description}</p>
                    <p className="mt-0.5 text-2xs text-muted-foreground">{formatDate(event.date)}</p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 text-xs font-bold',
                      event.value >= 0 ? 'text-chart-1' : 'text-chart-4',
                    )}
                  >
                    {event.value >= 0 ? '+' : ''}
                    {formatCurrency(event.value)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
