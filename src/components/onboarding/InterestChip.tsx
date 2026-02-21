import { cn } from "@/lib/utils";

interface InterestChipProps {
  label: string;
  selected: boolean;
  onToggle: (label: string) => void;
}

export function InterestChip({ label, selected, onToggle }: InterestChipProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(label)}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-[background-color,border-color,color] duration-[200ms]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
      )}
      style={
        selected
          ? {
              borderColor: "var(--color-accent)",
              backgroundColor: "var(--color-accent)",
              color: "#ffffff",
              fontFamily: "var(--font-ui)",
            }
          : {
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-ui)",
            }
      }
    >
      {label}
    </button>
  );
}
