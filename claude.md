# CLAUDE.md — CULTX (Cloud Code + Cursor)

You are Claude Code working inside this repository. Build a **culture-first, AI-amplified editorial platform** called **CULTX**.

## North Star
CULTX is a modern cultural blog/publication about Mexico with an AI layer that **amplifies reading**:
- Contextual exploration inside articles (select text → “Explore” panel)
- AI chat (bottom chatbar + sidebar + fullscreen)
- Multi-format outputs (audio/podcast + social summary)
- Weekly cultural brief (newsletter)
- Lightweight social layer (follow people with similar interests)

**Culture is the core.**  
**Geolocation/region is a secondary personalization layer** (mostly for events and optional highlights).  
Do not make the product feel like a map-first platform.

---

## Product Scope (Prototype)
### Pages (internal names)
- `P01 AuthLandingPage` — login/signup entry
- `P02 OnboardingInterestsPage` — interests multi-select
- `P03 OnboardingProfilePage` — profile type (General/Student/Academic)
- `P04 OnboardingRegionPage` — region (secondary)
- `P05 OnboardingExplorationModePage` — regional/national/both
- `P06 HomeFeedPage` — personalized home + proactive companion + chatbar
- `P07 ArticleReaderPage` — single demo article + contextual explore + audio + social summary + send to chat
- `P08 AIConversationPage` — fullscreen chat
- `P08b ConversationSidebar` — sidebar chat mode (component)
- `P09 DiscoverPage` — curated culture collections/threads (idea-first)
- `P10 ProfilePage` — preferences, newsletter, AI depth, saved
- `P11 SocialConnectionsPage` — suggested profiles, follow

### User Types
- **Guest**: can read, limited contextual explore + limited chat + basic audio
- **Logged-in Reader**: personalization, saved, full chat, newsletter, social
- **Academic Mode** (setting): deeper AI responses, references/citations style

---

## Build Priorities (MVP-first)
1) App shell + routing + base UI system (tokens)
2) Auth + onboarding flow + persistence
3) Home feed (personalized from onboarding) + Companion card
4) Article page (core) + contextual explore panel
5) Chat system (chatbar + sidebar + fullscreen) + shared conversation state
6) Audio mode (mock) + Social summary generator (mock)
7) Discover page (collections)
8) Profile settings
9) Social connections (mock suggestions)
10) Newsletter CTA/settings (mock)

---

## Tech Assumptions (Use unless project already differs)
- React + TypeScript (Next.js or Vite — follow repo defaults)
- Tailwind CSS for styling
- Local-first persistence: `localStorage` for prototype
- Data mocked in `/data/*.json`
- AI calls mocked (no external keys). Provide deterministic mock outputs.

If the repo already has a different stack, follow it.

---

## UX/UI Style Requirements (CULTX)
**Editorial, modern, youth-friendly**:
- Clean layout, generous whitespace
- Strong typography hierarchy
- Subtle, elegant surfaces (cards)
- Smooth microinteractions (hover/focus)
- Avoid “institutional government” vibe

### Token-first styling
Create a minimal token layer and use it everywhere:
- colors: background, surface, text primary/secondary, border, accent, focus ring
- spacing scale: 4/8/12/16/24/32/48
- radius: sm/md/lg
- shadows: sm/md

Prefer CSS variables in a single file (or Tailwind theme) so later we can convert to a design system.

---

## Data Model (Prototype)
Create lightweight JSON mocks:

### `/data/articles.json`
Include at least:
- `id`, `title`, `subtitle`, `author`, `publishedAt`
- `tags[]` (themes)
- `regionTags[]` (optional)
- `body` (string or blocks)
- `readingTime`

### `/data/users.json` (optional)
For social suggestions:
- `id`, `name`, `bio`, `interests[]`, `profileType`, `region`, `avatar`

### Local user profile in storage
Store under key: `cultx:user`
```json
{
  "userId": "string",
  "isLoggedIn": true,
  "interests": ["Architecture", "Theatre"],
  "profileType": "General|Student|Academic",
  "region": "North|Central|South|West|Peninsula",
  "explorationMode": "regional|national|both",
  "newsletter": { "enabled": true, "frequency": "weekly|biweekly" },
  "aiDepth": "standard|academic"
}

AI Layer (Mocked for Prototype)

Create an /ai folder with pure functions that return deterministic results:

personalizationEngine.ts — takes user profile + content list → returns ranked sections

contextualRAG.ts — takes selected text + article → returns explanation + related items

summaryGenerator.ts — returns social summary

podcastGenerator.ts — returns audio script + fake URL

weeklyGenerator.ts — returns newsletter draft (string)

affinityEngine.ts — returns suggested users

Output principles

Always reflect user profileType:

Academic: more detail, include “References:” section (mock)

General: concise, clear

Never hallucinate external facts; use the article text and mock references.

Key Interactions (Must Implement)
1) Contextual Explore in Article

User selects text → show floating CTA “Explore”

On click → open ContextualPanel (right side)

Panel includes:

explanation

related tags/articles

“Send to Chat” shortcut

Close panel keeps user on article

2) Chat Modes

Bottom Chatbar always visible

Sidebar chat opens from chatbar expand or “Send to Chat”

Fullscreen chat page P08 accessible from sidebar

Conversation state shared across modes

Logged-in users persist conversation in localStorage (key: cultx:chat)

3) Proactive Companion (Home + Article)

Show a subtle card that suggests:

“Explore a cultural thread”

“Try contextual explore”

“Generate a 5-min audio summary”
Rules:

Appears after onboarding or after a few interactions

Dismissible

Should not feel spammy

Folder Structure (Target)

Prefer this structure unless repo already enforces another:

/app
  /pages (or /routes)
  /components
  /ai
  /data
  /styles
  /lib
Coding Conventions

TypeScript strict typing

Components are small and composable

No unused props

Accessible by default:

keyboard navigation for modals/panels

focus ring visible

buttons have aria-label if icon-only

Keep mock AI deterministic (same input → same output)

Deliverables Checklist (Definition of Done)

A feature is done when:

UI works end-to-end without external services

State persists where expected (localStorage)

Empty states are handled

Loading states exist (even if mocked)

Components use tokens/styles consistently

Step-by-step Build Plan (Execute in Order)

Create tokens/theme and base layout (AppShell, Navbar)

Implement routing for all pages (placeholders ok)

Implement onboarding flow + persist profile

Build HomeFeedPage with mocked sections from personalization engine

Build ArticleReaderPage with:

article rendering

selection → Explore CTA

ContextualPanel

buttons: Listen, Social Summary, Send to Chat

Build chat system:

Chatbar

ConversationSidebar

AIConversationPage

shared store + persistence

Add Companion card logic (home/article)

Add Profile settings for interests/region/newsletter/aiDepth

Add DiscoverPage collections

Add SocialConnectionsPage suggestions + follow state (mock)

UI Copy Tone

Editorial, smart, human

Minimal but warm

Avoid corporate buzzwords
Examples:

“Explore this reference”

“Want a deeper take?”

“Turn this into a 5-min listen”

“Save for later”

What NOT to do

Don’t center the experience around geolocation/maps

Don’t invent external news/events facts

Don’t build a complex backend

Don’t introduce heavy libraries unless already in repo

Don’t over-design: keep it clean and prototype-friendly

If you need to make assumptions

Make reasonable defaults and keep them documented in code comments.
Prefer building working UI over perfect data.
