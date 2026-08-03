import { formatCurrency } from '@/lib/utils';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  formatter?: (value: number) => string;
}

export function ChartTooltip({ active, payload, label, formatter = formatCurrency }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="animate-in fade-in-0 zoom-in-95 rounded-xl border border-border/50 bg-card/95 p-4 shadow-xl backdrop-blur-sm">
      {label && (
        <p className="mb-3 border-b border-border/50 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      )}
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-sm font-medium">{entry.name}</span>
            </div>
            <span className="text-sm font-bold tabular-nums tracking-tight">{formatter(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
