---
phase: "04"
plan: "03"
subsystem: chat
tags: [chat, sidebar, fullscreen, routing, client-component, layout]
dependency_graph:
  requires: [chatStore, ChatProvider, useChatStore, GlobalChatbar-multi-state]
  provides: [ChatSidebar-P08b, ChatPage-P08, sidebar-layout-shift]
  affects: [AppShell, app-layout, article-page-layout]
tech_stack:
  added: []
  patterns: [fixed-panel positioning, client layout component, auto-scroll via useRef, sticky input footer]
key_files:
  created:
    - src/components/chat/ChatSidebar.tsx
    - src/app/(app)/chat/page.tsx
  modified:
    - src/app/(app)/layout.tsx
    - src/components/layout/AppShell.tsx
decisions:
  - "ChatSidebar renders null when chatMode !== 'sidebar' — keeps layout.tsx clean, no conditional in layout"
  - "AppShell converted to client component — only reads chatMode, no SSR data dependency"
  - "ArrowsOut in sidebar pushes router to /chat without changing chatMode — the fullscreen page reads shared store"
  - "Back button in fullscreen calls setChatMode('sidebar') + router.back() — restores article + sidebar simultaneously"
  - "paddingRight transition on AppShell (0.2s) prevents jarring layout shift when sidebar opens/closes"
metrics:
  duration_min: 3
  completed_date: "2026-02-21"
  tasks_completed: 2
  files_modified: 4
---

# Phase 04 Plan 03: ChatSidebar and Fullscreen Chat Page Summary

**One-liner:** 380px fixed ChatSidebar (P08b) with article context header and message bubbles, plus fullscreen /chat page (P08) with shared conversation state, connected via chatStore and AppShell layout shift.

## What Was Built

### Task 1 — ChatSidebar component (P08b) + layout wiring + AppShell sidebar shift

**`src/components/chat/ChatSidebar.tsx`** — 343-line client component:

- **Guard:** renders `null` when `chatMode !== "sidebar"` — logic stays inside the component, not in layout
- **Panel:** `position: fixed`, `right: 0`, `top: 0`, `width: 380px`, `height: 100vh`, `zIndex: 30`, surface background, left border, md shadow
- **Header (48px min-height):**
  - When `articleContext` is set: shows uppercase muted "Discutiendo:" label + truncated article title in primary color
  - When no context: shows "Compañero Cultural" heading
  - Right side: `ArrowsIn` (collapse → `setChatMode("minimal")`) and `ArrowsOut` (fullscreen → `router.push("/chat")`) Phosphor icons, both weight="thin" with hover opacity transition
- **Messages list:** `flex: 1`, `overflowY: auto`, `padding: 16px`, `gap: 12px`
  - Empty state: `ChatTeardrop` icon (24px, accent color) + "Inicia una conversación…" muted text
  - User messages: right-aligned, accent background, white text, asymmetric border-radius (lg lg sm lg)
  - Assistant messages: left-aligned, surface-raised background, primary text, asymmetric border-radius (lg lg lg sm)
  - Auto-scroll: `useEffect` on `messages` + `scrollIntoView({ behavior: "smooth" })` on a dummy anchor div
- **Input area:** textarea (rows=1, resize none, token styles), ArrowUp send button (rounded-full, accent when input has content), Enter-key submit without Shift, context-aware placeholder

**`src/app/(app)/layout.tsx`** — added `ChatSidebar` import and render inside `ChatProvider`, positioned after `GlobalChatbar`. `ChatSidebar` is `position: fixed` so it overlays without affecting document flow.

**`src/components/layout/AppShell.tsx`** — converted from server to client component (`"use client"`). Now reads `chatMode` from `useChatStore()`. Applies `paddingRight: "380px"` with `transition: "padding-right 0.2s"` when `chatMode === "sidebar"`, preventing article content from being hidden behind the fixed sidebar panel.

### Task 2 — Fullscreen chat page (P08)

**`src/app/(app)/chat/page.tsx`** — 339-line client component at route `/chat`:

- **Top bar (56px):**
  - Left: `CaretLeft` icon + "Volver al artículo" button → calls `setChatMode("sidebar")` + `router.back()` to restore article view with sidebar active
  - Center: `"Discutiendo: {articleContext}"` when context is set, `"Conversación cultural"` otherwise — muted, truncated with ellipsis
  - Right: `Trash` icon button → `clearMessages()`, aria-label="Limpiar conversación"
- **Messages list:** `flex: 1`, `overflowY: auto`, inner container `maxWidth: 720px`, `margin: 0 auto`
  - Empty state: `ChatTeardrop` (32px, accent), h2 "Empieza a explorar la cultura mexicana", muted subtext "Pregunta sobre lo que acabas de leer, un movimiento cultural, un artista…"
  - Message bubbles: same user/assistant styling as sidebar (accent right, surface-raised left)
  - Auto-scroll on new messages (same useRef + useEffect pattern)
- **Input area (`position: sticky`, `bottom: 0`):** surface background, top border, `maxWidth: 720px` centered, textarea (rows=2), ArrowUp send button, Enter-key submit, context-aware placeholder

Reads `messages`, `articleContext`, `setChatMode`, `addMessage`, `clearMessages` from `useChatStore()` — same shared store as sidebar, so message history is preserved when switching modes.

## Decisions Made

| Decision | Rationale |
|---|---|
| ChatSidebar self-guards with `chatMode !== "sidebar"` check | Keeps layout.tsx clean; component encapsulates its own visibility logic |
| AppShell converted to client component | Needed to read chatMode for padding shift; no SSR data dependencies, acceptable tradeoff |
| Router push to /chat without setting chatMode="fullscreen" | The fullscreen page reads directly from shared store; chatMode "fullscreen" is reserved for GlobalChatbar's null guard which is already handled |
| Back button: setChatMode("sidebar") + router.back() | Restores article page with sidebar active in a single action; avoids storing previous route |
| paddingRight transition on AppShell | Prevents jarring layout snap when sidebar opens or closes |

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

Files created/modified:
- FOUND: src/components/chat/ChatSidebar.tsx
- FOUND: src/app/(app)/chat/page.tsx
- FOUND: src/app/(app)/layout.tsx
- FOUND: src/components/layout/AppShell.tsx

Requirements satisfied:
- CHAT-03: Sidebar mode shows article alongside chat (AppShell paddingRight + fixed ChatSidebar)
- CHAT-04: Fullscreen chat mode accessible via ArrowsOut in sidebar
- CHAT-05: Fullscreen back button returns to sidebar; sidebar ArrowsIn collapses to minimal
- CHAT-07: Conversation history visible in both sidebar and fullscreen (shared chatStore)
- CHAT-09: "Discutiendo: [article title]" shown in both sidebar header and fullscreen top bar when articleContext is set

Build: npm run build — PASSED (zero errors, zero TypeScript errors)
