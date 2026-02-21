---
phase: "04-ai-companion"
plan: "01"
subsystem: "article-contextual-explore"
tags: [contextual-ai, text-selection, side-panel, mock-ai, article-reader]
dependency_graph:
  requires: []
  provides: [contextualRAG, TextSelectionTrigger, ContextualExplorePanel, ArticlePageClient]
  affects: [ArticleBody, article-page]
tech_stack:
  added: [src/ai/contextualRAG.ts]
  patterns: [deterministic-mock-ai, client-server-split, fixed-panel, text-selection-api]
key_files:
  created:
    - src/ai/contextualRAG.ts
    - src/components/article/TextSelectionTrigger.tsx
    - src/components/article/ContextualExplorePanel.tsx
    - src/components/article/ArticlePageClient.tsx
  modified:
    - src/components/article/ArticleBody.tsx
    - src/app/(app)/article/[id]/page.tsx
decisions:
  - "Pure deterministic AI mock: selectedText.length % 5 as index into 5 pre-written Spanish cultural responses"
  - "Server/client split: page.tsx stays server component; ArticlePageClient holds explore state"
  - "Position Explore button with position:fixed to avoid scroll/overflow issues"
  - "Panel is position:fixed right-0 so it overlays article without reflow"
metrics:
  duration_seconds: 191
  completed_date: "2026-02-21"
  tasks_completed: 2
  files_created: 4
  files_modified: 2
---

# Phase 4 Plan 01: Contextual Explore — Text Selection AI Panel Summary

**One-liner:** Text-selection-triggered contextual AI exploration panel with deterministic Spanish cultural responses and profile-aware depth labeling (General/Academic).

## What Was Built

### contextualRAG.ts — Deterministic Mock AI Function

Pure TypeScript function `getContextualResponse(selectedText, profileType)` that:
- Selects from 5 pre-written Spanish cultural explanations using `selectedText.length % 5`
- Sets `depthLabel` to "Academic" for `Academic` or `Cultural professional` profiles
- Appends a simulated Florescano reference citation for Academic depth
- Returns 2 static related article links (muralismo-rivera, talavera-puebla)
- Zero external calls, zero async — fully deterministic

### TextSelectionTrigger.tsx — Client Selection Detector

Wraps any content in a `<div>` with `onMouseUp`/`onTouchEnd` handlers:
- Calls `window.getSelection()` and shows floating button only when >= 10 chars selected
- Floating "Explorar" button: position:fixed above the selection, centered horizontally
- Uses Phosphor `MagnifyingGlass` weight="thin", accent background color, full border radius
- Clears on `selectionchange` with 150ms debounce so the Explore click registers first
- Props: `{ children: React.ReactNode; onExplore: (text: string) => void }`

### ContextualExplorePanel.tsx — Slide-in Side Panel

Fixed right-side panel (400px or 90vw) rendered when `selectedText` is not null:
- Header: depth label badge (General/Academic) + accessible X close button
- Quoted selection block with left accent border, clamped to 2 lines
- AI explanation with `white-space: pre-line` to preserve academic reference block newlines
- Related article links as `<Link>` elements with accent color and hover underline
- Escape key listener via `useEffect` while panel is open
- All tokens via CSS vars, Phosphor `X` weight="thin"

### ArticleBody.tsx — Selection-Aware Wrapper

Updated to accept optional `onExplore?: (text: string) => void`:
- If provided, wraps content in `<TextSelectionTrigger onExplore={onExplore}>`
- Falls back to plain render without trigger when prop is absent (backwards compatible)

### ArticlePageClient.tsx — Client State Wrapper

New `"use client"` component that holds `exploreText` and `profileType` state:
- Reads `getProfile()` on mount to set profileType for depth labeling
- Passes `onExplore` to `ArticleBody` and `selectedText` to `ContextualExplorePanel`
- Keeps full article layout: ArticleNav, ArticleHeader, ArticleToolbar, ArticleBody, SendToChatButton, NewsletterCTA

### page.tsx — Server Component Updated

Stays async server component for data fetching. Now delegates rendering to `<ArticlePageClient article={article} />`.

## Deviations from Plan

None — plan executed exactly as written.

The build error encountered during verification was a stale .next cache artifact caused by the git stash operation during investigation; the second build run succeeded cleanly.

## Success Criteria Verification

- [x] CTX-01: Text selection of 10+ chars shows floating "Explorar" button near selection
- [x] CTX-02: Clicking Explorar opens side panel without navigating away from article
- [x] CTX-03: Panel shows simulated AI cultural response in Spanish
- [x] CTX-04: Panel shows 2 related article links (muralismo-rivera, talavera-puebla)
- [x] CTX-05: Depth label matches user profile type (General/Academic)
- [x] CTX-06: X button and Escape key dismiss the panel

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | 8413ad4 | feat(04-01): create contextualRAG deterministic mock AI function |
| Task 2 | 3570fdd | feat(04-01): build text selection explore flow with contextual panel |

## Self-Check: PASSED
