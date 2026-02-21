"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const pathname = usePathname();

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "JD";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_90%,transparent)] backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/feed"
          className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-wide text-[var(--color-text-primary)]"
        >
          CULTX
        </Link>

        {!isLoading && isLoggedIn ? (
          <Link
            href="/profile"
            aria-label="Your profile"
            className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            style={{
              background:
                pathname === "/profile"
                  ? "var(--color-accent-hover)"
                  : "var(--color-accent)",
              fontFamily: "var(--font-ui)",
            }}
          >
            {initials}
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 hover:bg-[var(--color-surface-raised)]"
              style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 hover:opacity-90"
              style={{
                fontFamily: "var(--font-ui)",
                background: "var(--color-accent)",
                color: "#fff",
              }}
            >
              Join
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
