interface ProgressBarProps {
  current: number; // 1-based
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-ui)" }}>
        <span>Step {current} of {total}</span>
      </div>
      <div
        className="h-1 w-full rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-raised)" }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-[200ms]"
          style={{ width: `${percentage}%`, backgroundColor: "var(--color-accent)" }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Onboarding step ${current} of ${total}`}
        />
      </div>
    </div>
  );
}
