"use client";
import { useState, useEffect } from "react";
import { getProfile } from "@/lib/profile";
import { getPersonalizedFeed } from "@/lib/personalization";
import { HeroSection } from "./HeroSection";
import { CarouselSection } from "./CarouselSection";
import { CompanionCard } from "./CompanionCard";
import type { UserProfile } from "@/lib/types";

export function FeedContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setMounted(true);
  }, []);

  if (!mounted) {
    return <FeedSkeleton />;
  }

  const feed = getPersonalizedFeed(profile);
  const regionLabel = profile?.region ? `In ${profile.region} Mexico` : "In Your Region";
  const forYouSubtitle = profile?.onboardingComplete
    ? "Based on your interests"
    : "Top cultural reads";

  return (
    <>
      <HeroSection article={feed.hero} />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <CompanionCard />
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
    </>
  );
}

function FeedSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div
        className="border-b py-16 px-4"
        style={{ backgroundColor: "var(--color-surface-raised)", borderColor: "var(--color-border)" }}
      >
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="h-4 w-24 rounded-full" style={{ backgroundColor: "var(--color-washi-200)" }} />
          <div className="h-10 w-2/3 rounded" style={{ backgroundColor: "var(--color-washi-200)" }} />
          <div className="h-6 w-1/2 rounded" style={{ backgroundColor: "var(--color-washi-200)" }} />
        </div>
      </div>
      {/* Carousel skeletons */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-40 rounded" style={{ backgroundColor: "var(--color-washi-200)" }} />
            <div className="flex gap-4">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="min-w-[280px] h-40 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: "var(--color-washi-200)" }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
