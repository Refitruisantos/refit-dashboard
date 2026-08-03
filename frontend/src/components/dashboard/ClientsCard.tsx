import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RTooltip } from 'recharts';
import { UserRound, UserPlus, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartTooltip } from './ChartTooltip';
import { CHART_COLORS, formatNumber, formatSigned } from '@/lib/utils';
import type { ClientsBreakdown, NewClients } from '@/types/dashboard';

export function ClientsDonutCard({ clients }: { clients: ClientsBreakdown }) {
  const data = [
    { name: 'Ativos', value: clients.active, color: CHART_COLORS[1] },
    { name: 'Inativos', value: clients.inactive, color: CHART_COLORS[4] },
  ];

  return (
    <Card>
      <CardHeader
        title="Clientes"
        subtitle={`${formatNumber(clients.total)} no total`}
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
            <UserRound className="h-4 w-4 text-chart-2" strokeWidth={2} />
          </div>
        }
      />
      <CardContent>
        <div className="relative h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <RTooltip content={<ChartTooltip formatter={(value) => `${formatNumber(value)} clientes`} />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={70}
                paddingAngle={3}
                animationDuration={900}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{formatNumber(clients.total)}</span>
            <span className="text-[11px] text-muted">Total</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-chart-1/10 px-3 py-2">
            <p className="font-semibold text-chart-1">{formatNumber(clients.active)} ativos</p>
            <p className="text-muted-foreground">{clients.activePercent}%</p>
          </div>
          <div className="rounded-lg bg-chart-4/10 px-3 py-2">
            <p className="font-semibold text-chart-4">{formatNumber(clients.inactive)} inativos</p>
            <p className="text-muted-foreground">{clients.inactivePercent}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NewClientsCard({ newClients }: { newClients: NewClients }) {
  const diff = newClients.count - newClients.previous;

  return (
    <Card>
      <CardHeader
        title="Novos Clientes"
        subtitle="Aquisição no mês"
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-5/10">
            <UserPlus className="h-4 w-4 text-chart-5" strokeWidth={2} />
          </div>
        }
      />
      <CardContent>
        <p className="text-4xl font-bold tracking-tight text-chart-5">{formatNumber(newClients.count)}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {diff >= 0 ? '+' : ''}
          {diff} vs {newClients.previous} no mês anterior
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Taxa de crescimento</span>
            <span className="inline-flex items-center gap-1 font-semibold text-chart-1">
              <TrendingUp className="h-3.5 w-3.5" />
              {formatSigned(newClients.growthRate)}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted/20">
            <div
              className="h-full rounded-full bg-chart-5 transition-all duration-700"
              style={{ width: `${Math.min(newClients.growthRate * 2, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
