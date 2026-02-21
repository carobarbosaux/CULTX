"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CULTURAL_INTERESTS } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";
import { updateProfile, getProfile } from "@/lib/profile";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { InterestChip } from "@/components/onboarding/InterestChip";
import { Button } from "@/components/ui/Button";

export default function InterestsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(() =>
    typeof window !== "undefined" ? (getProfile()?.interests ?? []) : []
  );
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!getCurrentUser()) {
      router.push("/login");
    }
  }, [router]);

  function handleToggle(label: string) {
    setShowError(false);
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  }

  function handleContinue() {
    if (selected.length === 0) {
      setShowError(true);
      return;
    }
    updateProfile({ interests: selected });
    router.push("/profile-type");
  }

  return (
    <OnboardingShell
      step={1}
      title="What are your cultural interests?"
      subtitle="Select at least one to personalize your experience"
    >
      <div className="flex flex-wrap gap-3">
        {CULTURAL_INTERESTS.map((interest) => (
          <InterestChip
            key={interest}
            label={interest}
            selected={selected.includes(interest)}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {showError && (
        <p className="text-sm text-red-600 mt-2" role="alert">
          Select at least one interest to continue.
        </p>
      )}

      <Button
        variant="primary"
        size="lg"
        className="w-full mt-8"
        onClick={handleContinue}
        disabled={selected.length === 0}
      >
        Continue
      </Button>
    </OnboardingShell>
  );
}
