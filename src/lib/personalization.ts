import { getArticles, type Article } from "@/lib/articles";
import type { UserProfile } from "@/lib/types";

export interface PersonalizedFeed {
  hero: Article;
  forYou: Article[];
  inRegion: Article[];
  discover: Article[];
}

export function getPersonalizedFeed(profile: UserProfile | null): PersonalizedFeed {
  const all = getArticles();

  if (!profile || !profile.onboardingComplete) {
    // Guest or incomplete onboarding — return generic slices
    return {
      hero: all[0],
      forYou: all.slice(1, 5),
      inRegion: all.slice(5, 9),
      discover: all.slice(9, 12),
    };
  }

  // For You — filter by user interests, fallback to all
  const byInterests = all.filter((a) =>
    a.tags.some((tag) => profile.interests.includes(tag))
  );
  const forYouPool = byInterests.length >= 2 ? byInterests : all;

  // Hero — top matching article
  const hero = forYouPool[0];
  const forYou = forYouPool.slice(1, 5);

  // In Your Region — filter by region, fallback to generic slice
  const byRegion = profile.region
    ? all.filter((a) => a.regionTags.includes(profile.region!))
    : [];
  const inRegion = byRegion.length >= 2 ? byRegion.slice(0, 4) : all.slice(4, 8);

  // Discover — articles not already featured
  const usedIds = new Set([hero, ...forYou, ...inRegion].map((a) => a.id));
  const discover = all.filter((a) => !usedIds.has(a.id)).slice(0, 4);

  return { hero, forYou, inRegion, discover };
}
