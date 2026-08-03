import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800', className)} />;
}

export function CardSkeleton({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={cn('surface rounded-2xl border border-slate-200 p-5 dark:border-slate-800', height)}>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-2 h-3 w-20" />
      <Skeleton className="mt-6 h-[calc(100%-70px)] w-full" />
    </div>
  );
}

export function EmptyState({ title, message, icon }: { title: string; message?: string; icon?: ReactNode }) {
  return (
    <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 text-center">
      <div className="rounded-full bg-slate-100 p-3 text-slate-400 dark:bg-slate-800">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <p className="text-sm font-medium">{title}</p>
      {message && <p className="max-w-[240px] text-xs text-muted">{message}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-3 text-center">
      <div className="rounded-full bg-red-50 p-3 text-brand-red dark:bg-red-500/10">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium">Ocorreu um erro</p>
        <p className="max-w-[260px] text-xs text-muted">{message}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RefreshCcw className="h-3.5 w-3.5" /> Tentar novamente
        </Button>
      )}
    </div>
  );
}
