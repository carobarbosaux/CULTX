export const CULTURAL_INTERESTS = [
  "Theatre",
  "Painting",
  "Architecture",
  "Dance",
  "Literature",
  "Museums",
  "Exhibitions",
  "Film",
  "Cultural heritage",
  "Regional history",
  "Cultural events",
] as const;

export const PROFILE_TYPES = [
  "General audience",
  "Student",
  "Academic",
  "Cultural professional",
] as const;

export const REGIONS = [
  "North",
  "Central",
  "South",
  "West",
  "Peninsula",
] as const;

export const EXPLORATION_MODES = [
  "My region",
  "Entire Mexico",
  "Both",
] as const;

export type CulturalInterest = (typeof CULTURAL_INTERESTS)[number];
export type ProfileType = (typeof PROFILE_TYPES)[number];
export type Region = (typeof REGIONS)[number];
export type ExplorationMode = (typeof EXPLORATION_MODES)[number];

export const LOCAL_STORAGE_KEYS = {
  USER: "cultx:user",
  CHAT: "cultx:chat",
  GUEST_INTERACTIONS: "cultx:guest_interactions",
} as const;

export const GUEST_AI_LIMIT = 3;
