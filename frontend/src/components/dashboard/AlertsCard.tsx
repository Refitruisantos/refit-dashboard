import { AlertCircle, BellRing, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/states';
import { cn, formatCurrency } from '@/lib/utils';
import type { AlertLevel, DashboardAlert } from '@/types/dashboard';

const LEVEL_STYLES: Record<AlertLevel, string> = {
  success: 'border-chart-1/20 bg-chart-1/10 text-chart-1',
  warning: 'border-chart-3/20 bg-chart-3/10 text-chart-3',
  danger: 'border-chart-4/20 bg-chart-4/10 text-chart-4',
  info: 'border-chart-2/20 bg-chart-2/10 text-chart-2',
};

const LEVEL_ICONS: Record<AlertLevel, typeof Info> = {
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
  info: Info,
};

export function AlertsCard({ alerts }: { alerts: DashboardAlert[] }) {
  return (
    <Card>
      <CardHeader
        title="Alertas"
        subtitle={`${alerts.length} notificações`}
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
            <BellRing className="h-4 w-4 text-chart-3" strokeWidth={2} />
          </div>
        }
      />
      <CardContent>
        {alerts.length === 0 ? (
          <EmptyState title="Sem alertas" message="Todos os indicadores estão dentro do esperado." />
        ) : (
          <ul className="scrollbar-thin max-h-[320px] space-y-2 overflow-y-auto pr-1">
            {alerts.map((alert) => {
              const Icon = LEVEL_ICONS[alert.level];
              return (
                <li key={alert.id} className={cn('flex gap-2.5 rounded-lg border px-3 py-2', LEVEL_STYLES[alert.level])}>
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-tight">{alert.title}</p>
                    <p className="mt-0.5 text-2xs opacity-90">{alert.message}</p>
                  </div>
                  {alert.value !== undefined && alert.metric !== 'activeClients' && (
                    <span className="whitespace-nowrap text-xs font-bold">{formatCurrency(alert.value)}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
