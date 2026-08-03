import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/states';
import { ChartTooltip } from './ChartTooltip';
import { SERVICE_COLORS, formatCurrency } from '@/lib/utils';
import type { ServiceRevenue } from '@/types/dashboard';

export function RevenueByServiceCard({ data }: { data: ServiceRevenue[] }) {
  const total = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Card>
      <CardHeader
        title="Receita por Serviço"
        subtitle={`Total ${formatCurrency(total)}`}
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
            <BarChart3 className="h-4 w-4 text-chart-1" strokeWidth={2} />
          </div>
        }
      />
      <CardContent>
        {data.length === 0 ? (
          <EmptyState title="Sem receita registada" message="Não existem pagamentos para este período." />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="service"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                  height={48}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`}
                  width={40}
                />
                <RTooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.1)' }} />
                <Bar dataKey="revenue" name="Receita" radius={[6, 6, 0, 0]} animationDuration={800}>
                  {data.map((entry, index) => (
                    <Cell key={entry.service} fill={SERVICE_COLORS[index % SERVICE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
