import React from 'react';
import { cn } from '@/lib/utils';

interface MetricRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  unit?: string;
  highlight?: boolean;
}

export function MetricRow({ label, value, unit, highlight = false, className, ...props }: MetricRowProps) {
  return (
    <div className={cn("flex items-center justify-between py-2 border-b border-slate-100 last:border-0", className)} {...props}>
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <div className="flex items-baseline gap-1 text-right">
        <span className={cn("text-sm font-bold", highlight ? "text-slate-900" : "text-slate-700")}>
          {value}
        </span>
        {unit && <span className="text-xs text-slate-500 font-medium">{unit}</span>}
      </div>
    </div>
  );
}
