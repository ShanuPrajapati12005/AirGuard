import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AqiBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  aqi: number;
  category: string;
  colorHex: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AqiBadge({ aqi, category, colorHex, size = 'md', className, ...props }: AqiBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <div 
      className={cn("inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md", sizeClasses[size], className)}
      style={{ backgroundColor: `${colorHex}15`, color: colorHex, border: `1px solid ${colorHex}30` }}
      {...props}
    >
      <span>AQI {aqi}</span>
      <span className="opacity-50">•</span>
      <span>{category}</span>
    </div>
  );
}
