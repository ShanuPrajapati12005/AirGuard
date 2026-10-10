import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[9px] text-xs font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ac)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--ac)] text-[var(--onac)] border border-[var(--ac)] shadow-sm hover:opacity-90 hover:shadow-md relative overflow-hidden group",
        primary:
          "bg-[var(--ac)] text-[var(--onac)] border border-[var(--ac)] shadow-sm hover:opacity-90 hover:shadow-md relative overflow-hidden group",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
        outline:
          "border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--bg)] hover:border-[var(--ac)] shadow-[var(--sh)]",
        secondary:
          "border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--bg)] hover:border-[var(--line)] shadow-[var(--sh)]",
        ghost:
          "text-[var(--ink)] hover:bg-[var(--bg)] hover:text-[var(--ink)]",
        link:
          "text-[var(--ac)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3.5 py-1.5",
        sm: "h-8 rounded-[8px] px-2.5 text-[11px]",
        lg: "h-11 rounded-[10px] px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {variant === "primary" || variant === "default" ? (
          <>
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            <span className="relative z-10 flex items-center justify-center gap-1.5">{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
