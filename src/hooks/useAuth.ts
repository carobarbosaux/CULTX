"use client";
import { useState, useCallback } from "react";
import { getCurrentUser, signOut as authSignOut } from "@/lib/auth";
import type { UserProfile } from "@/lib/types";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() =>
    typeof window !== "undefined" ? getCurrentUser() : null
  );

  const signOut = useCallback(() => {
    authSignOut();
    setUser(null);
  }, []);

  return {
    user,
    isLoggedIn: user !== null,
    isLoading: false,
    signOut,
  };
}
