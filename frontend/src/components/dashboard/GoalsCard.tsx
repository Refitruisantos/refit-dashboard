import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import type { Goal } from '@/types/dashboard';

export function GoalsCard({ goals }: { goals: Goal[] }) {
  return (
    <Card>
      <CardHeader
        title="Objetivos"
        subtitle="Progresso das metas"
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-5/10">
            <Target className="h-4 w-4 text-chart-5" strokeWidth={2} />
          </div>
        }
      />
      <CardContent>
        <ul className="space-y-4">
          {goals.map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const formatter =
              goal.unit === 'currency'
                ? formatCurrency
                : goal.unit === 'percent'
                  ? (value: number) => formatPercent(value, 1)
                  : formatNumber;

            return (
              <li key={goal.id}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium">{goal.label}</span>
                  <span className="text-muted-foreground">
                    {formatter(goal.current)} / {formatter(goal.target)}
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/20">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, backgroundColor: goal.color }}
                  />
                </div>
                <p className="mt-1.5 text-right text-2xs font-semibold text-muted-foreground">{progress.toFixed(0)}%</p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
