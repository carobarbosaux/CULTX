"use client";
import { useState, useEffect, useCallback } from "react";
import { getCurrentUser, signOut as authSignOut } from "@/lib/auth";
import type { UserProfile } from "@/lib/types";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setIsLoading(false);
  }, []);

  const signOut = useCallback(() => {
    authSignOut();
    setUser(null);
  }, []);

  return {
    user,
    isLoggedIn: user !== null,
    isLoading,
    signOut,
  };
}
