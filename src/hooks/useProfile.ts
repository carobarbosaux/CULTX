"use client";
import { useState, useCallback } from "react";
import { getProfile, updateProfile } from "@/lib/profile";
import type { UserProfile } from "@/lib/types";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(() =>
    typeof window !== "undefined" ? getProfile() : null
  );

  const update = useCallback((updates: Partial<UserProfile>) => {
    const updated = updateProfile(updates);
    if (updated) setProfile(updated);
    return updated;
  }, []);

  return { profile, isLoading: false, update };
}
