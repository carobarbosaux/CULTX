---
plan: "02-03"
phase: "02-home-feed"
status: completed
completed_at: 2026-02-20
---

# Summary: 02-03 — Companion Card + Global Chatbar

## What Was Built

### Proactive Companion Card
- **`src/components/feed/CompanionCard.tsx`** — dismissible card above "For You" carousel:
  - Rotates between 3 suggestions (BookOpen / Sparkle / Headphones icons, Phosphor thin)
  - Sage-300 border, washi-100 background — warm but subtle
  - "Cultural Companion" eyebrow label in sage accent
  - Cormorant Garamond headline, DM Sans description
  - Dismissed with X button → `sessionStorage cultx:companion-dismissed`
  - Reappears on new browser session (sessionStorage, not localStorage)
- Injected into **`FeedContent.tsx`** above the first `CarouselSection`

### Global Chatbar
- **`src/components/chat/GlobalChatbar.tsx`** — two states:
  - **Minimal pill**: `fixed bottom-0`, rounded-full, `ChatTeardrop` icon + placeholder text, `shadow-md`
  - **Expanded**: full-width bottom bar with `textarea` (2 rows), X close button, send `ArrowUp` button (active when input non-empty)
- Registered in **`src/app/(app)/layout.tsx`** — visible on all `(app)` routes

### AppShell Bottom Padding
- **`src/components/layout/AppShell.tsx`** — `<main>` now has `pb-24` so page content never hides behind the chatbar

## Verification
- `npm run build` — zero TypeScript errors ✓
- CompanionCard renders above carousels, dismisses with X ✓
- GlobalChatbar pill visible at bottom, expands/collapses ✓
- Send button activates only when textarea has content ✓

## Files Created/Modified
| File | Status |
|------|--------|
| `src/components/feed/CompanionCard.tsx` | created |
| `src/components/chat/GlobalChatbar.tsx` | created |
| `src/components/feed/FeedContent.tsx` | modified (added CompanionCard) |
| `src/app/(app)/layout.tsx` | modified (added GlobalChatbar) |
| `src/components/layout/AppShell.tsx` | modified (pb-24 on main) |
