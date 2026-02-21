---
phase: 04-ai-companion
plan: "04"
subsystem: chat-ai-responses
tags: [chat, ai-mock, typing-indicator, deterministic, profile-depth]
dependency_graph:
  requires: [04-01, 04-02, 04-03]
  provides: [CHAT-08, CTX-05]
  affects: [ChatSidebar, GlobalChatbar, ChatPage, chatStore]
tech_stack:
  added: [chatResponder.ts, TypingIndicator.tsx]
  patterns: [deterministic-mock-ai, async-simulate-delay, profile-depth-adaptation]
key_files:
  created:
    - src/ai/chatResponder.ts
    - src/components/chat/TypingIndicator.tsx
  modified:
    - src/components/chat/ChatSidebar.tsx
    - src/app/(app)/chat/page.tsx
    - src/components/chat/GlobalChatbar.tsx
decisions:
  - "Extracted TypingIndicator as shared component rather than inlining in each surface — keeps bubble style consistent across 3 surfaces"
  - "Drawer auto-advances to sidebar after AI response — natural UX flow: quick question → sidebar shows full reply"
  - "Response pool index 8 reserved for article-context-aware fallback; non-article sessions falling on index 8 fall back to pool[0]"
  - "whiteSpace: pre-wrap added to message bubbles to correctly render newlines in academic appendage paragraphs"
metrics:
  duration: "~15 min"
  completed: "2026-02-21"
  tasks_completed: 2
  files_changed: 5
---

# Phase 4 Plan 04: AI Chat Response Wiring Summary

**One-liner:** Deterministic mock AI responses with profile-depth adaptation and animated typing indicator wired into all three chat surfaces (drawer/sidebar/fullscreen).

## What Was Built

### Task 1: chatResponder mock AI function (`src/ai/chatResponder.ts`)

Created a pure synchronous deterministic mock chat responder:

- **Response pool:** 9 pre-written Spanish cultural responses covering:
  1. Muralismo (Rivera, Orozco, Siqueiros)
  2. Arquitectura (UNAM, Barragán, Legorreta)
  3. Culturas prehispánicas (Maya, Aztec, Zapotec)
  4. Cine mexicano (Buñuel, Cuarón, del Toro)
  5. Música regional (son jarocho, norteño, cumbia)
  6. Arte contemporáneo mexicano
  7. Literatura (Paz, Fuentes, Poniatowska, Rulfo)
  8. Arte popular y artesanía
  9. Contextual fallback (references `articleContext` title directly)

- **Selection formula:** `(userMessage.length + messageCount) % 9` — ensures variety as conversation progresses, fully deterministic.

- **Profile depth adaptation:**
  - `Academic` or `Cultural professional` → appends one of 4 rotating "Contexto académico:" paragraphs with mock citations (García Canclini, Bonfil Batalla, Roger Bartra, Monsiváis)
  - `Student` → appends `"¿Te gustaría que profundizara en algún aspecto para tu investigación?"`
  - `General audience` / `null` → no appendage

### Task 2: Typing indicator + AI wiring across all chat surfaces

**`src/components/chat/TypingIndicator.tsx`** (new shared component):
- Three animated dots with staggered `animationDelay` (0s, 0.2s, 0.4s) using Tailwind `animate-pulse`
- Bubble matches assistant message style (`--color-surface-raised`, same border-radius)

**`src/components/chat/ChatSidebar.tsx`** (updated):
- `isTyping` state: disables textarea + send button while AI responds
- `profileType` state: loaded from `getProfile()` in `useEffect`
- `handleSend()` async: adds user message → sets isTyping → 800-1200ms delay → getChatResponse → adds AI message → clears isTyping
- `whiteSpace: pre-wrap` on message bubbles to render newline-separated academic appendages correctly
- `TypingIndicator` rendered after last message when `isTyping === true`
- Auto-scroll includes `isTyping` in dependency array so indicator stays visible

**`src/app/(app)/chat/page.tsx`** (updated):
- Same `isTyping` + `profileType` pattern as ChatSidebar
- Same `handleSend()` async pattern with getChatResponse
- `TypingIndicator` rendered in the messages list

**`src/components/chat/GlobalChatbar.tsx`** (updated):
- Same `isTyping` + `profileType` pattern
- After AI response is generated, automatically calls `setChatMode("sidebar")` — natural UX: quick drawer question expands to sidebar to show full reply
- Inline "El compañero cultural está escribiendo…" text indicator (drawer is compact, full TypingIndicator not shown)

## Decisions Made

1. **Shared TypingIndicator component** — extracted rather than inlined in 3 files. Ensures consistent bubble style and easier future changes.

2. **Drawer auto-expands to sidebar after response** — avoids user needing to see response in a compact drawer. The full reply appears in the sidebar where scrolling is comfortable.

3. **Index 8 reserved for contextual fallback** — when `articleContext` is set and conversation lands on index 8, the response directly references the article title. If no context and index 8 hits, falls back to pool[0] (muralismo).

4. **`whiteSpace: pre-wrap`** added to all message bubbles — academic appendages use `\n\n` before their paragraph, which renders correctly with this setting.

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Additional Work

**TypingIndicator extracted as shared component** (not in original plan spec — plan said "inline or extract"):
- Chose to extract to `src/components/chat/TypingIndicator.tsx` for consistency
- Used across ChatSidebar and ChatPage (not GlobalChatbar which uses a text fallback instead)
- This is consistent with the plan's allowance: "inline in each file, or extract to `src/components/chat/TypingIndicator.tsx`"

## Self-Check

### Created files exist

- `src/ai/chatResponder.ts` — created
- `src/components/chat/TypingIndicator.tsx` — created
- `.planning/phases/04-ai-companion/04-04-SUMMARY.md` — this file

### Modified files

- `src/components/chat/ChatSidebar.tsx` — updated (AI wiring + typing indicator)
- `src/app/(app)/chat/page.tsx` — updated (AI wiring + typing indicator)
- `src/components/chat/GlobalChatbar.tsx` — updated (AI wiring + drawer auto-expand)

## Self-Check: PASSED

All files created and modified as expected. TypeScript types are consistent: `getChatResponse` returns `string`, `ChatResponseInput` types match `chatStore` types, `getProfile()` returns `UserProfile | null` and `profileType` is correctly typed as `string | null` in component state.

---

## Checkpoint: Human Verification Required

Task 3 is a `checkpoint:human-verify` gate. The dev server must be started and the complete AI companion experience verified end-to-end before this plan is considered complete.

**Start dev server:** `npm run dev`
**Verify at:** `http://localhost:3000`
