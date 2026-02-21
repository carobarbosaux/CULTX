import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5",
        "font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-primary)]",
        "placeholder:text-[var(--color-text-muted)]",
        "transition-[border-color,box-shadow] duration-[200ms]",
        "focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
