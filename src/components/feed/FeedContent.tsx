"use client";
import { useState } from "react";
import { getProfile } from "@/lib/profile";
import { getPersonalizedFeed } from "@/lib/personalization";
import { HeroSection } from "./HeroSection";
import { CarouselSection } from "./CarouselSection";
import { CompanionCard } from "./CompanionCard";
import { CulturalCompanionOnboardingModal } from "./CulturalCompanionOnboardingModal";
import type { UserProfile } from "@/lib/types";

export function FeedContent() {
  const [profile] = useState<UserProfile | null>(() =>
    typeof window !== "undefined" ? getProfile() : null
  );
  const [showGuide, setShowGuide] = useState(false);

  const feed = getPersonalizedFeed(profile);
  const regionLabel = profile?.region ? `In ${profile.region} Mexico` : "In Your Region";
  const forYouSubtitle = profile?.onboardingComplete
    ? "Based on your interests"
    : "Top cultural reads";

  return (
    <>
      <HeroSection article={feed.hero} />
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* CompanionCard stays in place — clicking its CTA opens the modal */}
        <CompanionCard onOpenGuide={() => setShowGuide(true)} />
        <CarouselSection
          title="For You"
          subtitle={forYouSubtitle}
          articles={feed.forYou}
        />
        <CarouselSection
          title={regionLabel}
          articles={feed.inRegion}
        />
        <CarouselSection
          title="Discover Mexico"
          articles={feed.discover}
        />
      </div>

      {/* Floating onboarding modal — rendered in feed context (no articleId) */}
      {showGuide && (
        <CulturalCompanionOnboardingModal
          onClose={() => setShowGuide(false)}
        />
      )}
    </>
  );
}
