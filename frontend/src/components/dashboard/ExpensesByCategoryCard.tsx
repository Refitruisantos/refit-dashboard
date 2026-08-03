import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from 'recharts';
import { Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/states';
import { ChartTooltip } from './ChartTooltip';
import { SERVICE_COLORS, formatCurrency } from '@/lib/utils';
import type { CategoryExpense } from '@/types/dashboard';

export function ExpensesByCategoryCard({ data }: { data: CategoryExpense[] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader
        title="Despesas por Categoria"
        subtitle={`Total ${formatCurrency(total)}`}
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10">
            <Receipt className="h-4 w-4 text-chart-4" strokeWidth={2} />
          </div>
        }
      />
      <CardContent>
        {sorted.length === 0 ? (
          <EmptyState title="Sem despesas" message="Nenhuma despesa registada no período." />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 16, left: 6, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={90}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <RTooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.1)' }} />
                <Bar dataKey="value" name="Despesa" radius={[0, 6, 6, 0]} barSize={18} animationDuration={800}>
                  {sorted.map((entry, index) => (
                    <Cell key={entry.category} fill={SERVICE_COLORS[index % SERVICE_COLORS.length]} />
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
