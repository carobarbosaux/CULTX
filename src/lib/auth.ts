import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import type { UserProfile, AuthUser } from "@/lib/types";

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function signUp(email: string, _password: string, displayName?: string): AuthUser {
  // Prototype: store minimal auth. Password not hashed (prototype only).
  // In production this would be a real API call.
  const userId = generateUserId();
  const profile: UserProfile = {
    userId,
    isLoggedIn: true,
    email,
    displayName,
    interests: [],
    profileType: null,
    region: null,
    explorationMode: null,
    onboardingComplete: false,
    newsletter: { enabled: false, frequency: "weekly" },
    aiDepth: "standard",
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(profile));
  }
  return { userId, email, displayName };
}

export function signIn(email: string, _password: string): AuthUser | null {
  // Prototype: accept any credentials and return/create a user session.
  // Check if a user already exists for this email; if so restore their profile.
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
  if (stored) {
    const profile: UserProfile = JSON.parse(stored);
    if (profile.email === email) {
      const updated = { ...profile, isLoggedIn: true };
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updated));
      return { userId: profile.userId, email: profile.email, displayName: profile.displayName };
    }
  }
  // No matching user — create new session (prototype behavior)
  return signUp(email, _password);
}

export function signOut(): void {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
  if (stored) {
    const profile: UserProfile = JSON.parse(stored);
    const updated = { ...profile, isLoggedIn: false };
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updated));
  }
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
  if (!stored) return null;
  const profile: UserProfile = JSON.parse(stored);
  return profile.isLoggedIn ? profile : null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
