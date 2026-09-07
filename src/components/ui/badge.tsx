import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-display uppercase tracking-[0.25em] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent",
  {
    variants: {
      variant: {
        default: "border border-transparent bg-accent text-[var(--accent-foreground)]",
        secondary: "border border-border-dim bg-surface text-foreground",
        destructive:
          "border border-[var(--accent-amber)]/50 bg-[var(--accent-amber)]/10 text-[var(--accent-amber)]",
        outline: "text-foreground border border-border-dim",
        // Tactical variants for the cyber-defensive system
        tactical: "border border-accent/40 text-accent bg-accent/[0.04]",
        success: "border border-[var(--accent-green)]/50 text-[var(--accent-green)]",
        warning: "border border-[var(--accent-amber)]/50 text-[var(--accent-amber)]",
        process: "border border-dashed border-accent/50 text-accent",
        ghost: "text-muted-foreground border border-transparent",
      },
      size: {
        sm: "text-[9px] px-1.5 py-0.5",
        md: "text-[10px] px-2 py-0.5",
        lg: "text-[11px] px-2.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
  pulse?: boolean;
}

function Badge({ className, variant, size, dot, pulse, children, ...props }: BadgeProps) {
  const dotColor =
    variant === "success"
      ? "bg-[var(--accent-green)]"
      : variant === "warning" || variant === "destructive"
        ? "bg-[var(--accent-amber)]"
        : variant === "process" || variant === "tactical" || variant === "default"
          ? "bg-accent"
          : "bg-current";
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn("size-1 rounded-full shrink-0", dotColor, pulse && "animate-pulse")}
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
