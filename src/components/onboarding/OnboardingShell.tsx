import Link from "next/link";
import { ProgressBar } from "./ProgressBar";

interface OnboardingShellProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function OnboardingShell({
  step,
  totalSteps = 4,
  title,
  subtitle,
  children,
}: OnboardingShellProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="w-full max-w-lg space-y-8">
        {/* Wordmark */}
        <div className="text-center">
          <Link
            href="/feed"
            className="text-2xl font-semibold hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            CULTX
          </Link>
        </div>

        {/* Progress */}
        <ProgressBar current={step} total={totalSteps} />

        {/* Heading */}
        <div className="space-y-2">
          <h1
            className="text-3xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm" style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Step content */}
        {children}
      </div>
    </div>
  );
}
