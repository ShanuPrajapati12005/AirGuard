import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface NotificationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  message: string;
  type?: 'default' | 'warning' | 'success' | 'error';
  action?: React.ReactNode;
}

export function NotificationCard({ icon, title, message, type = 'default', action, className, ...props }: NotificationCardProps) {
  const typeStyles = {
    default: "bg-slate-50 border-slate-200 text-slate-800",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    error: "bg-rose-50 border-rose-200 text-rose-900",
  };

  const iconStyles = {
    default: "text-slate-500",
    warning: "text-amber-500",
    success: "text-emerald-500",
    error: "text-rose-500",
  };

  return (
    <Card className={cn("p-4 flex items-start justify-between gap-3 shadow-sm", typeStyles[type], className)} {...props}>
      <div className="flex items-start gap-3">
        {icon && <div className={cn("mt-0.5", iconStyles[type])}>{icon}</div>}
        <div>
          <h4 className="text-sm font-bold">{title}</h4>
          <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{message}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Card>
  );
}
