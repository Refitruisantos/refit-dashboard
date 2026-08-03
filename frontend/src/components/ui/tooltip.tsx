import type { ReactNode } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';

export const TooltipProvider = RadixTooltip.Provider;

export function Tooltip({ content, children }: { content: string; children?: ReactNode }) {
  return (
    <RadixTooltip.Root delayDuration={150}>
      <RadixTooltip.Trigger asChild>
        <button type="button" className="text-slate-400 transition-colors hover:text-slate-600" aria-label="Informação">
          {children ?? <Info className="h-3.5 w-3.5" />}
        </button>
      </RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          sideOffset={6}
          className="z-50 max-w-[240px] rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          {content}
          <RadixTooltip.Arrow className="fill-slate-900" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
