import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartTooltip } from './ChartTooltip';
import { CHART_COLORS, formatCurrency } from '@/lib/utils';
import type { MonthlyRevenue } from '@/types/dashboard';

export function RevenueByMonthCard({ data }: { data: MonthlyRevenue[] }) {
  const total = data.reduce((sum, item) => sum + item.revenue, 0);
  const avg = total / data.length;
  const lastMonth = data[data.length - 1];
  const growth = data.length > 1 ? ((lastMonth.revenue - data[data.length - 2].revenue) / data[data.length - 2].revenue) * 100 : 0;

  return (
    <Card>
      <CardHeader
        title="Receita Mensal"
        subtitle={`Média ${formatCurrency(avg)} · ${growth > 0 ? '+' : ''}${growth.toFixed(1)}% vs mês anterior`}
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
            <TrendingUp className="h-4 w-4 text-chart-1" strokeWidth={2} />
          </div>
        }
      />
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[1]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`}
                width={40}
              />
              <RTooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Receita"
                stroke={CHART_COLORS[1]}
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                animationDuration={800}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
