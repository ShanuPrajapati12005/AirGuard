import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-tight transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]",
        secondary:
          "border-[var(--line)] bg-[var(--card)] text-[var(--ink)] shadow-[var(--sh)]",
        accent:
          "border-[var(--ac)]/30 bg-[var(--ac)]/10 text-[var(--ac)] font-semibold",
        success:
          "border-[var(--ok)]/30 bg-[var(--ok)]/10 text-[var(--ok)] font-semibold",
        destructive:
          "border-rose-200 bg-rose-50 text-rose-700",
        outline:
          "border-[var(--line)] text-[var(--mut)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
