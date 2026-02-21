# Requirements: CULTX

**Defined:** 2026-02-20
**Core Value:** A reader can select any text in an article and instantly explore its cultural context through an AI companion — without leaving the reading experience.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication & Onboarding

- [ ] **AUTH-01**: User can sign up with email, Google, or Apple
- [ ] **AUTH-02**: User session persists across browser refresh
- [ ] **AUTH-03**: User can log out from any page
- [ ] **ONBD-01**: User can select cultural interests (multi-select: Theatre, Painting, Architecture, Dance, Literature, Museums, Exhibitions, Film, Cultural heritage, Regional history, Cultural events)
- [ ] **ONBD-02**: User must select at least one interest before proceeding
- [ ] **ONBD-03**: User can select profile type (General audience / Student / Academic / Cultural professional)
- [ ] **ONBD-04**: User can select their region in Mexico (North / Central / South / West / Peninsula)
- [ ] **ONBD-05**: User can choose exploration mode (My region / Entire Mexico / Both)
- [ ] **ONBD-06**: Onboarding selections are saved to user profile and influence feed

### Home Feed

- [ ] **FEED-01**: Logged-in user sees personalized home feed with "For You" carousel
- [ ] **FEED-02**: Home feed shows "In Your Region" editorial carousel
- [ ] **FEED-03**: Home feed shows "Discover Mexico" carousel
- [ ] **FEED-04**: Home feed includes editorial hero section
- [ ] **FEED-05**: Guest user sees a generic (non-personalized) version of the feed
- [ ] **FEED-06**: Proactive Cultural Companion card appears contextually on home feed
- [ ] **FEED-07**: Global Chatbar is visible at bottom of home feed page

### Article Reader

- [ ] **ART-01**: User can read an article with full editorial layout (title, byline, body text, images)
- [ ] **ART-02**: Article uses Japandi Calm Tech typography (Cormorant Garamond for display, DM Sans for body)
- [ ] **ART-03**: Reading max width is 720px for comfortable reading measure
- [ ] **ART-04**: "Listen" button is visible in article toolbar (UI only — no real audio for prototype)
- [ ] **ART-05**: "Instagram Summary" button is visible (UI only for prototype)
- [ ] **ART-06**: Newsletter CTA appears at end of article
- [ ] **ART-07**: Global Chatbar is visible at bottom of article page

### Contextual Exploration (AI Feature)

- [x] **CTX-01**: User can select text in an article to trigger a floating "Explore" action button
- [x] **CTX-02**: Clicking "Explore" opens a contextual side panel without removing user from the article
- [x] **CTX-03**: Side panel displays a simulated AI response (cultural context, expanded explanation)
- [x] **CTX-04**: Side panel shows related articles links
- [x] **CTX-05**: Side panel response depth label adapts to user profile type (general vs academic label)
- [x] **CTX-06**: User can dismiss the contextual panel and return to reading

### AI Conversation (Chat)

- [ ] **CHAT-01**: Global Chatbar is visible at bottom of screen in minimal state with context-aware placeholder
- [ ] **CHAT-02**: Chatbar expands into a drawer when user focuses/clicks it
- [x] **CHAT-03**: User can open AI chat as a persistent sidebar (article remains visible alongside)
- [x] **CHAT-04**: User can expand AI chat to fullscreen conversation mode
- [x] **CHAT-05**: User can collapse fullscreen back to sidebar or minimal chatbar
- [ ] **CHAT-06**: "Send to Chat" action in article passes article title + summary context to AI chat
- [x] **CHAT-07**: AI chat sidebar shows conversation history within the session
- [ ] **CHAT-08**: AI responses in chat are simulated (placeholder text that feels contextually aware)
- [x] **CHAT-09**: Chat context displays current article awareness ("Discussing: [article title]")

### Explore Mexico Map

- [ ] **MAP-01**: User can navigate to the Explore Mexico page
- [ ] **MAP-02**: Interactive map displays Mexico's 5 regions (North / Central / South / West / Peninsula)
- [ ] **MAP-03**: User can click a region to see cultural movements and article collections for that region
- [ ] **MAP-04**: Map companion suggestion card appears with cultural route or deep dive prompt
- [ ] **MAP-05**: Regional article collections are linked to actual article cards

### Profile

- [ ] **PROF-01**: User can view their profile page with interests, region, and profile type
- [ ] **PROF-02**: User can edit their cultural interests from profile settings
- [ ] **PROF-03**: User can change their region from profile settings
- [ ] **PROF-04**: User can toggle AI depth (general / academic) from profile settings
- [ ] **PROF-05**: User can subscribe/unsubscribe to weekly newsletter (UI only — no real email)

### Design System

- [ ] **DS-01**: All screens use Japandi Calm Tech color tokens (Washi Paper neutrals, Sage accent)
- [ ] **DS-02**: Typography follows role definitions (Cormorant for display/hero, DM Sans for all UI)
- [ ] **DS-03**: Spacing follows 4px base grid system throughout
- [ ] **DS-04**: Motion follows calm tech rules (200ms ease_in_out, no bouncing, skeleton loaders)
- [ ] **DS-05**: All interactive elements meet WCAG AA contrast (4.5:1 minimum)
- [ ] **DS-06**: Icons use Phosphor Icons (thin weight) throughout
- [ ] **DS-07**: Dark mode tokens available (light mode primary for v1, dark mode bonus)

## v2 Requirements

Deferred to future release.

### Real AI Integration

- **AI-01**: Contextual exploration responses powered by real LLM API (Claude or GPT-4)
- **AI-02**: AI companion personalization adapts to user reading history
- **AI-03**: AI-generated cultural routes on the map
- **AI-04**: Persistent AI conversation history across sessions

### Content & Media

- **CONT-01**: Real articles pulled from Notion CMS
- **CONT-02**: Podcast/audio narration of articles (standard, academic, 5-min summary)
- **CONT-03**: Instagram summary generation with copy-to-clipboard

### Social Layer

- **SOCL-01**: User can view suggested cultural profiles based on shared interests
- **SOCL-02**: User can follow other users
- **SOCL-03**: User can see followed users' cultural activity

### Newsletter

- **NEWS-01**: Real weekly newsletter email delivery
- **NEWS-02**: Newsletter content personalized by interests/region/profile type

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real AI API calls | Portfolio prototype — simulated responses demonstrate the design pattern |
| Social connections | Not core to article+AI showcase, high complexity |
| Audio narration | Implementation complexity out of scope for portfolio |
| Real email sending | No backend email infrastructure needed |
| Mobile app | Web-first prototype only |
| Real CMS integration | Lorem ipsum / simulate text; real content added later from Notion |
| Admin panel | Not needed for portfolio prototype |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DS-01 | Phase 1 | Pending |
| DS-02 | Phase 1 | Pending |
| DS-03 | Phase 1 | Pending |
| DS-04 | Phase 1 | Pending |
| DS-05 | Phase 1 | Pending |
| DS-06 | Phase 1 | Pending |
| DS-07 | Phase 1 | Pending |
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| ONBD-01 | Phase 1 | Pending |
| ONBD-02 | Phase 1 | Pending |
| ONBD-03 | Phase 1 | Pending |
| ONBD-04 | Phase 1 | Pending |
| ONBD-05 | Phase 1 | Pending |
| ONBD-06 | Phase 1 | Pending |
| FEED-01 | Phase 2 | Pending |
| FEED-02 | Phase 2 | Pending |
| FEED-03 | Phase 2 | Pending |
| FEED-04 | Phase 2 | Pending |
| FEED-05 | Phase 2 | Pending |
| FEED-06 | Phase 2 | Pending |
| FEED-07 | Phase 2 | Pending |
| ART-01 | Phase 3 | Pending |
| ART-02 | Phase 3 | Pending |
| ART-03 | Phase 3 | Pending |
| ART-04 | Phase 3 | Pending |
| ART-05 | Phase 3 | Pending |
| ART-06 | Phase 3 | Pending |
| ART-07 | Phase 3 | Pending |
| CTX-01 | Phase 4 | Complete |
| CTX-02 | Phase 4 | Complete |
| CTX-03 | Phase 4 | Complete |
| CTX-04 | Phase 4 | Complete |
| CTX-05 | Phase 4 | Complete |
| CTX-06 | Phase 4 | Complete |
| CHAT-01 | Phase 4 | Pending |
| CHAT-02 | Phase 4 | Pending |
| CHAT-03 | Phase 4 | Complete |
| CHAT-04 | Phase 4 | Complete |
| CHAT-05 | Phase 4 | Complete |
| CHAT-06 | Phase 4 | Pending |
| CHAT-07 | Phase 4 | Complete |
| CHAT-08 | Phase 4 | Pending |
| CHAT-09 | Phase 4 | Complete |
| MAP-01 | Phase 5 | Pending |
| MAP-02 | Phase 5 | Pending |
| MAP-03 | Phase 5 | Pending |
| MAP-04 | Phase 5 | Pending |
| MAP-05 | Phase 5 | Pending |
| PROF-01 | Phase 6 | Pending |
| PROF-02 | Phase 6 | Pending |
| PROF-03 | Phase 6 | Pending |
| PROF-04 | Phase 6 | Pending |
| PROF-05 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 55 total
- Mapped to phases: 55
- Unmapped: 0

---
*Requirements defined: 2026-02-20*
*Last updated: 2026-02-20 after roadmap creation — traceability updated, coverage confirmed 55/55*
