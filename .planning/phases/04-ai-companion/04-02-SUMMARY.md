---
phase: "04"
plan: "02"
subsystem: chat
tags: [chat, state-management, context, localStorage, react-context]
dependency_graph:
  requires: []
  provides: [chatStore, ChatProvider, useChatStore, GlobalChatbar-multi-state, SendToChatButton-wired]
  affects: [GlobalChatbar, SendToChatButton, ArticlePageClient, app-layout]
tech_stack:
  added: []
  patterns: [React Context for shared state, localStorage persistence, SSR-safe guards, client re-export wrapper]
key_files:
  created:
    - src/lib/chatStore.ts
    - src/components/chat/ChatProvider.tsx
  modified:
    - src/components/chat/GlobalChatbar.tsx
    - src/components/article/SendToChatButton.tsx
    - src/app/(app)/layout.tsx
decisions:
  - "React Context over Zustand/Redux — project rule: no heavy libraries"
  - "Client wrapper (ChatProvider.tsx) re-exports store — avoids converting layout.tsx to a client component"
  - "chatMode defaults to 'minimal' — chatbar always starts as pill"
  - "GlobalChatbar renders null for sidebar/fullscreen — those modes render their own UI in 04-03/04-04"
  - "Conversation preview line shown in drawer for UX continuity"
metrics:
  duration_min: 2
  completed_date: "2026-02-21"
  tasks_completed: 2
  files_modified: 5
---

# Phase 04 Plan 02: Chat Store and GlobalChatbar Multi-State Summary

**One-liner:** React Context chat store with localStorage persistence wiring GlobalChatbar into 3-state pill/drawer/sidebar behavior and SendToChatButton to pass article context.

## What Was Built

### Task 1 — chatStore (shared chat state)

`src/lib/chatStore.ts` provides the single source of truth for the entire chat system:

- **Types exported:** `ChatMode` (`"minimal" | "drawer" | "sidebar" | "fullscreen"`), `ChatMessage`, `ChatStore`
- **`ChatProvider`:** React Context provider managing `messages`, `chatMode`, `articleContext` state
  - Loads persisted messages from `localStorage["cultx:chat"]` on mount
  - Saves messages to localStorage on every change
  - SSR-safe: all `localStorage` access behind `typeof window !== "undefined"` guard
  - `addMessage`: appends with `crypto.randomUUID()` id and `Date.now()` timestamp
  - `clearMessages`: resets state and removes localStorage key
- **`useChatStore()`:** hook that throws if called outside provider (fast failure in dev)
- **`src/components/chat/ChatProvider.tsx`:** thin `"use client"` re-export so `layout.tsx` remains a server component
- **`src/app/(app)/layout.tsx`:** wrapped children in `<ChatProvider>` alongside existing `<AppShell>` and `<GlobalChatbar>`

### Task 2 — GlobalChatbar upgrade + SendToChatButton wiring

**`src/components/chat/GlobalChatbar.tsx`** upgraded to read from `useChatStore()`:

- **Minimal state** (pill): context-aware placeholder — shows `"Pregunta sobre «{articleTitle}»…"` when article context is set, else `"Pregunta sobre cultura mexicana…"`. Click → `setChatMode("drawer")`
- **Drawer state** (expanded): article context badge with clear X, textarea with same context-aware placeholder, Enter key sends (no Shift), action column with: close (X → minimal), expand (ArrowsOut → sidebar), send (ArrowUp)
- **Sidebar / fullscreen states**: renders `null` — those components render their own UI in plans 04-03 and 04-04
- Conversation history preview line shown at bottom of drawer for UX continuity

**`src/components/article/SendToChatButton.tsx`** wired to chatStore:

- Prop renamed from `_articleTitle` to `articleTitle`
- On click: `setArticleContext(articleTitle)` → `setChatMode("drawer")` → 2s inline confirmation "Artículo enviado al chat"
- No more "Fase 4" stub notice

`src/app/(app)/article/[id]/page.tsx` (and `ArticlePageClient.tsx` from 04-01) updated to pass `articleTitle={article.title}`.

## Decisions Made

| Decision | Rationale |
|---|---|
| React Context, not Zustand/Redux | Project rule: no heavy libraries |
| Thin `ChatProvider.tsx` client re-export | Keeps `layout.tsx` as server component; Next.js App Router pattern |
| `chatMode` defaults to `"minimal"` | Pill always visible — core UX requirement |
| `GlobalChatbar` renders null for sidebar/fullscreen | Clean separation; those modes own their own UI (04-03, 04-04) |
| Conversation preview line in drawer | UX continuity — user sees their conversation without opening fullscreen |

## Deviations from Plan

None — plan executed exactly as written.

The linter (Cursor background agent) automatically updated `page.tsx` to use the `ArticlePageClient` pattern from plan 04-01. The `articleTitle` prop was already correct in `ArticlePageClient.tsx`. The build passed cleanly.

## Self-Check: PASSED

Files created/modified:
- FOUND: src/lib/chatStore.ts
- FOUND: src/components/chat/ChatProvider.tsx
- FOUND: src/components/chat/GlobalChatbar.tsx
- FOUND: src/components/article/SendToChatButton.tsx
- FOUND: src/app/(app)/layout.tsx

Commits:
- 7cb9ec8: feat(04-02): create chatStore and wire ChatProvider into app layout
- f672777: feat(04-02): upgrade GlobalChatbar to 3-state and wire SendToChatButton

Build: npm run build — PASSED (zero errors, zero TypeScript errors)
