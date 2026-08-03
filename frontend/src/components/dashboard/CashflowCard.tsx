import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from 'recharts';
import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartTooltip } from './ChartTooltip';
import { CHART_COLORS, formatCurrency, cn } from '@/lib/utils';
import type { CashflowRow } from '@/types/dashboard';

export function CashflowCard({ data }: { data: CashflowRow[] }) {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const chartData = data.map((row) => ({
    month: row.month,
    Entradas: row.inflow,
    Saídas: row.outflow,
    Lucro: row.profit,
  }));

  const toggleSeries = (dataKey: string) => {
    setHiddenSeries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey);
      } else {
        newSet.add(dataKey);
      }
      return newSet;
    });
  };

  const series = [
    { key: 'Entradas', name: 'Entradas', color: CHART_COLORS[1] },
    { key: 'Saídas', name: 'Saídas', color: CHART_COLORS[4] },
    { key: 'Lucro', name: 'Lucro', color: CHART_COLORS[5] },
  ];

  return (
    <Card>
      <CardHeader
        title="Fluxo Financeiro"
        subtitle={`${data.length} meses registados`}
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
            <Wallet className="h-4 w-4 text-chart-2" strokeWidth={2} />
          </div>
        }
      />
      <CardContent>
        {/* Legenda Interativa */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {series.map(s => (
            <button
              key={s.key}
              onClick={() => toggleSeries(s.key)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                hiddenSeries.has(s.key)
                  ? 'border-border/30 bg-muted/20 text-muted-foreground/50 opacity-50'
                  : 'border-border/50 bg-card hover:border-border hover:shadow-sm'
              )}
            >
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,340px]">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[1]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="outflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[4]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS[4]} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[5]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS[5]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} dy={8} />
                <YAxis
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`}
                  width={40}
                />
                <RTooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '5 5' }} />
                {!hiddenSeries.has('Entradas') && (
                  <Area
                    type="monotone"
                    dataKey="Entradas"
                    stroke={CHART_COLORS[1]}
                    strokeWidth={2.5}
                    fill="url(#inflowGradient)"
                    animationDuration={1000}
                    animationBegin={0}
                    dot={false}
                  />
                )}
                {!hiddenSeries.has('Saídas') && (
                  <Area
                    type="monotone"
                    dataKey="Saídas"
                    stroke={CHART_COLORS[4]}
                    strokeWidth={2.5}
                    fill="url(#outflowGradient)"
                    animationDuration={1000}
                    animationBegin={100}
                    dot={false}
                  />
                )}
                {!hiddenSeries.has('Lucro') && (
                  <Area
                    type="monotone"
                    dataKey="Lucro"
                    stroke={CHART_COLORS[5]}
                    strokeWidth={2.5}
                    fill="url(#profitGradient)"
                    animationDuration={1000}
                    animationBegin={200}
                    dot={false}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="scrollbar-thin max-h-72 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 surface border-b border-slate-200 dark:border-slate-800">
                <tr className="text-left text-muted">
                  <th className="pb-2 pr-2 font-medium">Mês</th>
                  <th className="pb-2 pr-2 text-right font-medium">Entradas</th>
                  <th className="pb-2 pr-2 text-right font-medium">Saídas</th>
                  <th className="pb-2 pr-2 text-right font-medium">Lucro</th>
                  <th className="pb-2 text-right font-medium">Margem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 pr-2 font-medium">{row.month}</td>
                    <td className="py-2 pr-2 text-right text-green-600 dark:text-green-400">
                      {formatCurrency(row.inflow)}
                    </td>
                    <td className="py-2 pr-2 text-right text-red-600 dark:text-red-400">
                      {formatCurrency(row.outflow)}
                    </td>
                    <td className="py-2 pr-2 text-right font-semibold">{formatCurrency(row.profit)}</td>
                    <td className="py-2 text-right text-muted">{row.margin}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
