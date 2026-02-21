---
plan: "01-02"
phase: "01-foundation"
status: completed
completed_at: 2026-02-20
---

# Summary: 01-02 — Auth Screens + localStorage Session

## What Was Built

### Types
- **`src/lib/types.ts`** — `UserProfile` interface matching the `cultx:user` localStorage schema (userId, isLoggedIn, email, displayName, interests, profileType, region, explorationMode, onboardingComplete, newsletter, aiDepth). Also exports `AuthUser`.

### Auth Logic
- **`src/lib/auth.ts`** — localStorage-based session layer:
  - `signUp(email, password, displayName?)` — creates new `UserProfile` in `cultx:user`, sets `isLoggedIn: true`
  - `signIn(email, password)` — restores existing profile if email matches, otherwise creates new one (prototype behavior)
  - `signOut()` — sets `isLoggedIn: false` in localStorage (preserves profile for re-login)
  - `getCurrentUser()` — returns profile if `isLoggedIn: true`, else `null`
  - `isAuthenticated()` — boolean helper

### Auth Hook
- **`src/hooks/useAuth.ts`** — `useAuth()` hook returning `{ user, isLoggedIn, isLoading, signOut }`. Reads localStorage on mount, updates React state. `"use client"` directive.

### Auth Route Group — `src/app/(auth)/`
- **`layout.tsx`** — Full-screen centered layout with `--color-bg` background. No main Navbar (auth screens are self-contained).
- **`login/page.tsx`** (`/login`):
  - Cormorant Garamond heading "Welcome back"
  - Email + password inputs with `<label htmlFor>` associations
  - Primary "Sign in" button → `signIn()` → `router.push("/feed")`
  - Inline error state on failure
  - Divider + disabled Google / Apple buttons (UI-only, `title="Available in full version"`)
  - Link to `/signup`
- **`signup/page.tsx`** (`/signup`):
  - Heading "Join CULTX"
  - Optional Name field + Email + Password inputs
  - "Create account" → `signUp()` → `router.push("/onboarding/interests")`
  - Same disabled social buttons pattern
  - Link to `/login`

### Navbar Updated
- **`src/components/layout/Navbar.tsx`** — now `"use client"`, imports `useAuth`. Shows "Log out" button (ghost variant, `<SignOut>` Phosphor icon, thin weight) only when `isLoggedIn: true`. On click: `signOut()` + `router.push("/login")`.

## Verification
- `npm run build` — zero TypeScript errors ✓
- Routes generated: `/`, `/login`, `/signup`, `/_not-found` ✓
- Compiled in 1413ms (Turbopack) ✓

## Flows Working
| Flow | Behavior |
|------|----------|
| `/` | Redirects to `/login` |
| Signup | Creates `cultx:user` in localStorage, redirects to `/onboarding/interests` (404 — next plan) |
| Login | Restores/creates session, redirects to `/feed` (404 — next phase) |
| Refresh | localStorage persists → session survives refresh |
| Logout | Sets `isLoggedIn: false`, redirects to `/login` |

## Files Created/Modified
| File | Status |
|------|--------|
| `src/lib/types.ts` | created |
| `src/lib/auth.ts` | created |
| `src/hooks/useAuth.ts` | created |
| `src/app/(auth)/layout.tsx` | created |
| `src/app/(auth)/login/page.tsx` | created |
| `src/app/(auth)/signup/page.tsx` | created |
| `src/components/layout/Navbar.tsx` | modified |
