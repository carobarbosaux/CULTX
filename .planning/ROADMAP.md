# Roadmap: CULTX

## Overview

CULTX is built as a portfolio prototype demonstrating AI product design skills. The roadmap moves from foundation (design system + auth + onboarding) through content delivery (feed, article reader) to the signature differentiator (AI contextual exploration and chat companion), then completes the experience with the Explore Mexico map and user profile management. Every phase delivers a coherent, verifiable capability — nothing ships half-finished.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Design system, project scaffold, auth, and onboarding — the platform exists and users can enter it
- [ ] **Phase 2: Home Feed** - Personalized editorial feed with carousels and companion entry points — users have somewhere to go after onboarding
- [ ] **Phase 3: Article Reader** - Full editorial reading experience with layout, typography, and toolbar — users can read cultural content
- [ ] **Phase 4: AI Companion** - Contextual text exploration and persistent chat sidebar/fullscreen — the signature portfolio differentiator
- [ ] **Phase 5: Explore Mexico Map** - Interactive regional map with cultural collections — users can discover Mexico by region
- [ ] **Phase 6: Profile** - User profile view and settings management — users can control their preferences

## Phase Details

### Phase 1: Foundation
**Goal**: The platform exists, design system is applied, and users can create accounts and complete onboarding
**Depends on**: Nothing (first phase)
**Requirements**: DS-01, DS-02, DS-03, DS-04, DS-05, DS-06, DS-07, AUTH-01, AUTH-02, AUTH-03, ONBD-01, ONBD-02, ONBD-03, ONBD-04, ONBD-05, ONBD-06
**Success Criteria** (what must be TRUE):
  1. A new user can sign up with email or Google, and their session persists after a browser refresh
  2. A user can log out from any page and be returned to the auth screen
  3. A logged-in user can complete the full onboarding flow (interests → profile type → region → exploration mode) and their selections are saved
  4. Every screen uses Japandi Calm Tech tokens — Washi Paper neutrals, Cormorant Garamond display type, DM Sans UI type, Phosphor thin icons, 4px grid spacing
  5. All interactive elements meet WCAG AA contrast (4.5:1 minimum) and animations follow calm tech rules (200ms, no bounce)
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — Next.js 14 scaffold with Japandi Calm Tech design system tokens, AppShell, and base UI primitives
- [ ] 01-02-PLAN.md — Auth screens (P01): signup, login, session persistence, logout — localStorage-based
- [ ] 01-03-PLAN.md — Onboarding flow (P02-P05): interests, profile type, region, exploration mode, profile persistence

### Phase 2: Home Feed
**Goal**: Logged-in users see a personalized editorial home feed with carousels and companion entry points; guests see a generic version
**Depends on**: Phase 1
**Requirements**: FEED-01, FEED-02, FEED-03, FEED-04, FEED-05, FEED-06, FEED-07
**Success Criteria** (what must be TRUE):
  1. A logged-in user sees a home feed with three editorial carousels: "For You," "In Your Region," and "Discover Mexico"
  2. A guest (not logged in) sees a generic non-personalized version of the feed without crashing
  3. A hero editorial section appears at the top of the home feed
  4. A Proactive Cultural Companion card appears contextually on the feed surface
  5. The Global Chatbar is visible in its minimal state at the bottom of the page
**Plans**: TBD

Plans:
- [ ] 02-01: Home feed layout (P06) — hero section, carousel structure with lorem ipsum article cards
- [ ] 02-02: Personalization state — logged-in carousels vs guest fallback view
- [ ] 02-03: Companion entry points — Proactive Companion card and Global Chatbar minimal state

### Phase 3: Article Reader
**Goal**: Users can read an article in a full editorial layout with the correct typography, toolbar, and companion entry points
**Depends on**: Phase 2
**Requirements**: ART-01, ART-02, ART-03, ART-04, ART-05, ART-06, ART-07
**Success Criteria** (what must be TRUE):
  1. A user can navigate from the home feed to an article and read it with title, byline, body text, and images laid out in a 720px max-width column
  2. Display text uses Cormorant Garamond and body text uses DM Sans, matching Japandi Calm Tech typography roles
  3. The article toolbar shows "Listen" and "Instagram Summary" buttons (UI only — no real functionality)
  4. A newsletter CTA appears at the end of the article
  5. The Global Chatbar is visible at the bottom of the article page
**Plans**: TBD

Plans:
- [ ] 03-01: Article page layout (P07) — editorial structure, typography, 720px measure, simulated content
- [ ] 03-02: Article toolbar — Listen button, Instagram Summary button (UI only)
- [ ] 03-03: Article footer and feed integration — newsletter CTA, chatbar presence, navigation back to feed

### Phase 4: AI Companion
**Goal**: Users can select text in an article to explore its cultural context, and can engage in a persistent AI chat in sidebar or fullscreen mode — all with simulated responses
**Depends on**: Phase 3
**Requirements**: CTX-01, CTX-02, CTX-03, CTX-04, CTX-05, CTX-06, CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, CHAT-06, CHAT-07, CHAT-08, CHAT-09
**Success Criteria** (what must be TRUE):
  1. A user can select any text in the article and see a floating "Explore" action button appear
  2. Clicking "Explore" opens a contextual side panel with a simulated AI response and related article links, without navigating away from the article
  3. The side panel response depth label reflects the user's profile type (general vs academic language)
  4. A user can dismiss the panel, then expand the Global Chatbar into a persistent sidebar where the article remains visible alongside the chat
  5. A user can expand the chat to fullscreen mode and collapse it back to sidebar or minimal chatbar state
  6. "Send to Chat" from the article passes context, and the chat header shows "Discussing: [article title]"
**Plans**: TBD

Plans:
- [ ] 04-01: Contextual exploration (CTX) — text selection trigger, floating Explore button, side panel with simulated response and related links
- [ ] 04-02: Global Chatbar states — minimal chatbar, drawer expansion, Send to Chat action
- [ ] 04-03: AI Chat sidebar and fullscreen (P08/P08b) — sidebar layout with article visible, fullscreen mode, collapse/expand state transitions
- [ ] 04-04: Chat intelligence surface — simulated responses, session conversation history, article context awareness, profile-type depth label

### Phase 5: Explore Mexico Map
**Goal**: Users can navigate to the Explore Mexico page, interact with the regional map, and discover cultural article collections by region
**Depends on**: Phase 2
**Requirements**: MAP-01, MAP-02, MAP-03, MAP-04, MAP-05
**Success Criteria** (what must be TRUE):
  1. A user can navigate to the Explore Mexico page from the main navigation
  2. An interactive map displays Mexico's 5 regions (North, Central, South, West, Peninsula) and a user can click each region
  3. Clicking a region reveals cultural movements and linked article card collections for that region
  4. A companion suggestion card appears with a cultural route or deep dive prompt
**Plans**: TBD

Plans:
- [ ] 05-01: Explore Mexico page layout (P09) — page shell, navigation integration
- [ ] 05-02: Interactive regional map — 5-region SVG map, click interaction, region selection state
- [ ] 05-03: Regional content — cultural collections per region, article card links, companion suggestion card

### Phase 6: Profile
**Goal**: Users can view their profile and edit their preferences from a dedicated settings page
**Depends on**: Phase 1
**Requirements**: PROF-01, PROF-02, PROF-03, PROF-04, PROF-05
**Success Criteria** (what must be TRUE):
  1. A user can navigate to their profile page and see their saved interests, region, and profile type
  2. A user can edit their cultural interests from profile settings and the changes persist
  3. A user can change their region and toggle AI depth (general / academic) from settings
  4. A user can toggle newsletter subscription (UI only — no real email sending)
**Plans**: TBD

Plans:
- [ ] 06-01: Profile page (P10) — layout, display of interests, region, and profile type
- [ ] 06-02: Profile settings — edit interests, change region, toggle AI depth, newsletter toggle

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6
Note: Phase 5 depends on Phase 2 (not Phase 4), so it can begin after Phase 3/4 if needed.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/3 | Not started | - |
| 2. Home Feed | 0/3 | Not started | - |
| 3. Article Reader | 0/3 | Not started | - |
| 4. AI Companion | 0/4 | Not started | - |
| 5. Explore Mexico Map | 0/3 | Not started | - |
| 6. Profile | 0/2 | Not started | - |
