"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { EXPLORATION_MODES, type ExplorationMode } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";
import { completeOnboarding, getProfile } from "@/lib/profile";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const MODE_DESCRIPTORS: Record<ExplorationMode, string> = {
  "My region": "Focus on cultural content from your selected region",
  "Entire Mexico": "Discover culture from every corner of Mexico",
  "Both": "Regional highlights plus national discovery",
};

export default function ExplorationModePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ExplorationMode | null>(null);

  useEffect(() => {
    if (!getCurrentUser()) {
      router.push("/login");
      return;
    }
    const profile = getProfile();
    if (profile?.explorationMode) {
      setSelected(profile.explorationMode);
    }
  }, [router]);

  function handleComplete() {
    if (!selected) return;
    completeOnboarding({ explorationMode: selected });
    router.push("/feed");
  }

  return (
    <OnboardingShell
      step={4}
      title="How do you want to explore?"
      subtitle="Choose your default discovery scope"
    >
      <div className="flex flex-col gap-3">
        {EXPLORATION_MODES.map((mode) => (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={selected === mode}
            onClick={() => setSelected(mode)}
            className={cn(
              "w-full rounded-lg border p-4 text-left transition-[border-color,background-color] duration-[200ms]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            )}
            style={
              selected === mode
                ? {
                    borderColor: "var(--color-accent)",
                    backgroundColor: "var(--color-surface-raised)",
                  }
                : {
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }
            }
          >
            <p
              className="text-lg font-medium"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
            >
              {mode}
            </p>
            <p
              className="text-sm mt-0.5"
              style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}
            >
              {MODE_DESCRIPTORS[mode]}
            </p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-8">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex items-center gap-1.5 text-sm transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
          style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-ui)" }}
        >
          <ArrowLeft size={16} weight="thin" />
          Back
        </button>

        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={handleComplete}
          disabled={!selected}
        >
          Start exploring
        </Button>
      </div>
    </OnboardingShell>
  );
}
