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
    <Card className={cn("overflow-hidden border-slate-200/60 shadow-sm", className)} {...props}>
      {(title || headerAction) && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </Card>
  );
}
