"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { REGIONS, type Region } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";
import { updateProfile, getProfile } from "@/lib/profile";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const REGION_SUBTITLES: Record<Region, string> = {
  "North": "Sonora, Chihuahua, Nuevo León and more",
  "Central": "Mexico City, Puebla, Querétaro and more",
  "South": "Oaxaca, Chiapas, Guerrero and more",
  "West": "Jalisco, Colima, Nayarit and more",
  "Peninsula": "Yucatán, Campeche, Quintana Roo",
};

export default function RegionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Region | null>(null);

  useEffect(() => {
    if (!getCurrentUser()) {
      router.push("/login");
      return;
    }
    const profile = getProfile();
    if (profile?.region) {
      setSelected(profile.region);
    }
  }, [router]);

  function handleContinue() {
    updateProfile({ region: selected });
    router.push("/exploration-mode");
  }

  function handleSkip() {
    updateProfile({ region: null });
    router.push("/exploration-mode");
  }

  return (
    <OnboardingShell
      step={3}
      title="Where in Mexico are you based?"
      subtitle="Used for regional content highlights"
    >
      <div className="flex flex-col gap-3">
        {REGIONS.map((region) => (
          <button
            key={region}
            type="button"
            role="radio"
            aria-checked={selected === region}
            onClick={() => setSelected(region)}
            className={cn(
              "w-full rounded-lg border p-4 text-left transition-[border-color,background-color] duration-[200ms]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            )}
            style={
              selected === region
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
              {region}
            </p>
            <p
              className="text-sm mt-0.5"
              style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}
            >
              {REGION_SUBTITLES[region]}
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

      <button
        type="button"
        onClick={handleSkip}
        className="w-full text-center text-sm mt-3 transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
        style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-ui)" }}
      >
        Skip for now
      </button>
    </OnboardingShell>
  );
}
