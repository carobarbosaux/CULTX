---
plan: "01-03"
phase: "01-foundation"
status: completed
completed_at: 2026-02-20
---

# Summary: 01-03 — Onboarding Flow (P02–P05)

## What Was Built

### Profile Persistence Lib
- **`src/lib/profile.ts`** — `getProfile()`, `updateProfile(partial)`, `completeOnboarding(partial)`. All write to `localStorage cultx:user`. SSR-safe (`typeof window` guard).

### Onboarding Components
- **`src/components/onboarding/ProgressBar.tsx`** — animated progress fill (sage accent), `role="progressbar"` with aria values. Shows "Step N of 4".
- **`src/components/onboarding/InterestChip.tsx`** — toggleable pill chip with `aria-pressed`, sage accent selected state, token-based hover on unselected.
- **`src/components/onboarding/OnboardingShell.tsx`** — shared layout wrapper: CULTX wordmark, ProgressBar, Cormorant Garamond h1, DM Sans subtitle, content slot.

### Onboarding Route Group — `src/app/(onboarding)/`
- **`layout.tsx`** — passthrough layout (no Navbar during onboarding)

### Onboarding Pages
| Route | Step | Component | Saves to profile |
|-------|------|-----------|-----------------|
| `/onboarding/interests` | 1/4 | 11 InterestChips (flex-wrap) | `interests[]` |
| `/onboarding/profile-type` | 2/4 | 4 radio-style selection cards | `profileType` |
| `/onboarding/region` | 3/4 | 5 region cards + "Skip for now" | `region` (nullable) |
| `/onboarding/exploration-mode` | 4/4 | 3 mode cards | `explorationMode` + `onboardingComplete: true` |

### Validation & UX
- Interests: Continue disabled until ≥1 selected; error message on attempted submit with 0
- Profile type, exploration mode: Continue disabled until a card is selected
- Region: Continue disabled until selected; "Skip for now" link persists `region: null` and advances
- Steps 2–4: Back button with `<ArrowLeft>` Phosphor icon (thin), `router.back()`
- Auth guard on all pages: `getCurrentUser()` in `useEffect` → `router.push("/login")` if null
- Selections pre-populated from localStorage on mount (survives back-navigation)
- Final step button text: "Start exploring"
- Final step calls `completeOnboarding()` → sets `onboardingComplete: true`

## Verification
- `npm run build` — zero TypeScript errors ✓
- 10 routes generated (8 app routes + not-found + root) ✓
- Compiled in 1346ms (Turbopack) ✓

## Complete localStorage Shape After Onboarding
```json
{
  "userId": "user_...",
  "isLoggedIn": true,
  "email": "...",
  "displayName": "...",
  "interests": ["Theatre", "Architecture"],
  "profileType": "Student",
  "region": "Central",
  "explorationMode": "Both",
  "onboardingComplete": true,
  "newsletter": { "enabled": false, "frequency": "weekly" },
  "aiDepth": "standard"
}
```

## Files Created
| File | Status |
|------|--------|
| `src/lib/profile.ts` | created |
| `src/components/onboarding/ProgressBar.tsx` | created |
| `src/components/onboarding/InterestChip.tsx` | created |
| `src/components/onboarding/OnboardingShell.tsx` | created |
| `src/app/(onboarding)/layout.tsx` | created |
| `src/app/(onboarding)/interests/page.tsx` | created |
| `src/app/(onboarding)/profile-type/page.tsx` | created |
| `src/app/(onboarding)/region/page.tsx` | created |
| `src/app/(onboarding)/exploration-mode/page.tsx` | created |
