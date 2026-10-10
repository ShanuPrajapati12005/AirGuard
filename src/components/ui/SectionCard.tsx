import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface SectionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export function SectionCard({ title, subtitle, headerAction, children, className, ...props }: SectionCardProps) {
  return (
    <Card className={cn("overflow-hidden border border-[var(--line)] shadow-[var(--sh)]", className)} {...props}>
      {(title || headerAction) && (
        <div className="px-5 py-3.5 border-b border-[var(--line)] flex items-center justify-between bg-[var(--bg)]/40">
          <div>
            {title && <h3 className="font-display text-base font-medium text-[var(--ink)]">{title}</h3>}
            {subtitle && <p className="text-xs text-[var(--mut)] mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </Card>
  );
}
