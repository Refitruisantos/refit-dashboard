import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'green' | 'red' | 'blue' | 'orange' | 'purple' | 'slate';

const tones: Record<Tone, string> = {
  green: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  red: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  orange: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  purple: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

export function Badge({ tone = 'slate', className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
