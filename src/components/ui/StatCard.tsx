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
    <Card className={cn("p-6 flex flex-col", className)} {...props}>
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h3>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className={cn("text-3xl font-black mt-1", valueClassName)}>{value}</div>
      {subtitle && <div className="text-sm text-slate-500 mt-1 font-medium">{subtitle}</div>}
    </Card>
  );
}
