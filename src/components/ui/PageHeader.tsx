import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6", className)} {...props}>
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight text-[var(--ink)]">{title}</h2>
        {subtitle && <p className="text-xs text-[var(--mut)] mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
