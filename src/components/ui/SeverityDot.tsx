import React from 'react';
import { cn } from '@/lib/utils';

interface SeverityDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  colorHex: string;
  animate?: boolean;
}

export function SeverityDot({ colorHex, animate = false, className, ...props }: SeverityDotProps) {
  return (
    <span className={cn("relative flex h-2.5 w-2.5 shrink-0", className)} {...props}>
      {animate && (
        <span 
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ backgroundColor: colorHex }}
        ></span>
      )}
      <span 
        className="relative inline-flex rounded-full h-2.5 w-2.5"
        style={{ backgroundColor: colorHex }}
      ></span>
    </span>
  );
}
