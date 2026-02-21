export interface UserProfile {
  userId: string;
  isLoggedIn: boolean;
  email: string;
  displayName?: string;
  interests: string[];
  profileType: "General audience" | "Student" | "Academic" | "Cultural professional" | null;
  region: "North" | "Central" | "South" | "West" | "Peninsula" | null;
  explorationMode: "My region" | "Entire Mexico" | "Both" | null;
  onboardingComplete: boolean;
  newsletter: { enabled: boolean; frequency: "weekly" | "biweekly" };
  aiDepth: "standard" | "academic";
}

export interface AuthUser {
  userId: string;
  email: string;
  displayName?: string;
}
