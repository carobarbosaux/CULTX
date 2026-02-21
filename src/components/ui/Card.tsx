import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]",
        "transition-shadow duration-[200ms]",
        className
      )}
      style={{ boxShadow: "var(--shadow-sm)", ...style }}
      {...props}
    />
  )
);
Card.displayName = "Card";
