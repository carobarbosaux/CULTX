import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-[family-name:var(--font-ui)] font-medium rounded-md",
          "transition-[background-color,box-shadow] duration-[200ms]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" && "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
          variant === "secondary" && "bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]",
          variant === "ghost" && "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
