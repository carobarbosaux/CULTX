import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import type { UserProfile } from "@/lib/types";

export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
  return stored ? JSON.parse(stored) : null;
}

export function updateProfile(updates: Partial<UserProfile>): UserProfile | null {
  if (typeof window === "undefined") return null;
  const current = getProfile();
  if (!current) return null;
  const updated = { ...current, ...updates };
  localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updated));
  return updated;
}

export function completeOnboarding(finalUpdates: Partial<UserProfile>): UserProfile | null {
  return updateProfile({ ...finalUpdates, onboardingComplete: true });
}
