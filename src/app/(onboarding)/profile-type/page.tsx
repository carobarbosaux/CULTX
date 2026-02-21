"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";
import { updateProfile, getProfile } from "@/lib/profile";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const DESCRIPTORS: Record<ProfileType, string> = {
  "General audience": "Cultural curiosity, accessible explanations",
  "Student": "Learning-focused, structured context",
  "Academic": "Deep analysis, references and citations",
  "Cultural professional": "Industry perspective, practice-oriented",
};

export default function ProfileTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ProfileType | null>(() =>
    typeof window !== "undefined" ? (getProfile()?.profileType ?? null) : null
  );

  useEffect(() => {
    if (!getCurrentUser()) {
      router.push("/login");
    }
  }, [router]);

  function handleContinue() {
    if (!selected) return;
    updateProfile({ profileType: selected });
    router.push("/region");
  }

  return (
    <OnboardingShell
      step={2}
      title="How do you engage with culture?"
      subtitle="This shapes how the AI companion responds"
    >
      <div className="flex flex-col gap-3">
        {PROFILE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={selected === type}
            onClick={() => setSelected(type)}
            className={cn(
              "w-full rounded-lg border p-4 text-left transition-[border-color,background-color] duration-[200ms]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            )}
            style={
              selected === type
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
              {type}
            </p>
            <p
              className="text-sm mt-0.5"
              style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}
            >
              {DESCRIPTORS[type]}
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
          onClick={handleContinue}
          disabled={!selected}
        >
          Continue
        </Button>
      </div>
    </OnboardingShell>
  );
}
