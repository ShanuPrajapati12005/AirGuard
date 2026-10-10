import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", description = "We encountered an error loading this data.", onRetry, className, ...props }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 border border-rose-100 rounded-xl bg-rose-50/50", className)} {...props}>
      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-rose-900">{title}</h3>
      <p className="text-xs text-rose-700 mt-1 max-w-xs mb-4">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="text-rose-700 border-rose-200 hover:bg-rose-100">
          Try Again
        </Button>
      )}
    </div>
  );
}
