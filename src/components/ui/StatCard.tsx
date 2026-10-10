import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  valueClassName?: string;
}

export function StatCard({ title, value, subtitle, icon, valueClassName, className, ...props }: StatCardProps) {
  return (
    <Card className={cn("p-5 flex flex-col border border-[var(--line)] shadow-[var(--sh)]", className)} {...props}>
      <div className="flex items-center justify-between pb-1.5">
        <h3 className="text-[10px] font-medium uppercase tracking-wider text-[var(--mut)]">{title}</h3>
        {icon && <div className="text-[var(--mut)]">{icon}</div>}
      </div>
      <div className={cn("font-display text-3xl font-normal text-[var(--ink)] mt-0.5", valueClassName)}>{value}</div>
      {subtitle && <div className="text-xs text-[var(--mut)] mt-1">{subtitle}</div>}
    </Card>
  );
}
