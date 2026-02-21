"use client";
import { useState, useEffect, useCallback } from "react";
import { getProfile, updateProfile } from "@/lib/profile";
import type { UserProfile } from "@/lib/types";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProfile(getProfile());
    setIsLoading(false);
  }, []);

  const update = useCallback((updates: Partial<UserProfile>) => {
    const updated = updateProfile(updates);
    if (updated) setProfile(updated);
    return updated;
  }, []);

  return { profile, isLoading, update };
}
