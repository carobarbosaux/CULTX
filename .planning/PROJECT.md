# CULTX

## What This Is

CULTX is an AI-first cultural editorial platform focused on Mexico, built as a portfolio prototype showcasing AI product design skills. It combines a Medium-style editorial reading experience with a simulated AI Cultural Companion — demonstrating how AI can amplify and contextualize cultural content without replacing editorial voice. The prototype prioritizes the Article Reader + AI Conversation experience as its signature differentiator.

## Core Value

A reader can select any text in an article and instantly explore its cultural context through an AI companion — without leaving the reading experience.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can complete onboarding (auth → interests → profile type → region → exploration mode)
- [ ] User can view a personalized home feed with editorial carousels (For You, In Your Region, Discover Mexico)
- [ ] User can read an article with full editorial layout
- [ ] User can select text and trigger a contextual "Explore" panel (AI response simulated with placeholder/lorem)
- [ ] User can send article context to the AI chat sidebar
- [ ] User can expand AI chat to fullscreen conversation mode
- [ ] User can switch AI companion between sidebar and fullscreen states
- [ ] User can explore Mexico via an interactive regional map (cultural collections per region)
- [ ] User can view and edit their profile (interests, region, AI depth)
- [ ] Japandi Calm Tech design system applied consistently across all screens

### Out of Scope

- Real AI API calls — portfolio prototype uses simulated/placeholder responses
- Social layer (follow/connect users) — deferred, not core to the article+AI showcase
- Podcast/audio narration — high complexity, not demonstrating AI design pattern
- Weekly newsletter backend — no real email sending for prototype
- Instagram summary generator — deferred
- Mobile app — web-first prototype only
- Real CMS — articles use lorem ipsum / simulate text (Notion content added later)

## Context

- **Portfolio project** for Carolina Barbosa, demonstrating AI product design thinking end-to-end (PRD → user stories → design system → working prototype)
- **Design system**: Japandi Calm Tech v1.0.0 — Washi Paper color scale, DM Sans + Cormorant Garamond typography, Phosphor Icons (thin), generous negative space, calm motion
- **Content**: Articles use lorem ipsum / simulate text initially; real content to be added from Notion later
- **AI simulation**: The companion UI is fully designed and functional, but AI responses are simulated (hardcoded/placeholder) — the design pattern is what matters for the portfolio
- **Page architecture** from PRD: P01 Auth → P02-P05 Onboarding → P06 Home Feed → P07 Article Reader → P08/P08b AI Conversation (fullscreen + sidebar) → P09 Explore Mexico Map → P10 Profile

## Constraints

- **Design System**: Japandi Calm Tech v1.0.0 — all visual decisions must follow its tokens, typography rules, spacing system, motion specs, and accessibility requirements
- **No real AI**: Companion responses are simulated — no external LLM API budget required
- **Portfolio-grade quality**: Visual craft and UX detail matter more than scale/performance
- **Mexico focus**: All content, map data, and cultural references are Mexico-specific

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Article + AI Panel as v1 core | This is the signature differentiator that demonstrates AI product design skills | — Pending |
| Simulated AI responses | Portfolio prototype — design pattern matters, not real AI | — Pending |
| Japandi Calm Tech design system | Pre-defined by Carolina — gives strong visual identity | — Pending |
| Web-first (no mobile app) | Portfolio prototype optimization — desktop reading experience | — Pending |
| Lorem ipsum content | Real articles added from Notion later — unblocks prototype build | — Pending |

---
*Last updated: 2026-02-20 after initialization*
