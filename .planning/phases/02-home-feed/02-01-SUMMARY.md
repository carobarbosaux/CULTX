---
plan: "02-01"
phase: "02-home-feed"
status: completed
completed_at: 2026-02-20
---

# Summary: 02-01 — Feed Layout + Article Data

## What Was Built

### Mock Data
- **`data/articles.json`** — 12 articles covering Mexican culture across all 5 regions, 8 interest categories, bilingual Spanish titles. Shape: id, title, subtitle, author, publishedAt, tags[], regionTags[], readingTime, excerpt.

### Data Access Lib
- **`src/lib/articles.ts`** — `Article` interface + `getArticles()`, `getArticleById()`, `getArticlesByTag()`, `getArticlesByRegion()` helpers. Reads from JSON via `resolveJsonModule`.

### Feed Components
- **`src/components/feed/ArticleCard.tsx`** — 280px fixed-width card: tag chip, 2-line-clamped title (Cormorant), author + reading time row. Links to `/article/[id]`.
- **`src/components/feed/CarouselSection.tsx`** — Section header (title + optional subtitle) + horizontally scrollable `ArticleCard` row (`scrollbarWidth: none`).
- **`src/components/feed/HeroSection.tsx`** — Full-width `surface-raised` hero: tag chip, large Cormorant title (text-4xl/5xl), subtitle, author+time, "Read article" secondary button.

### App Route Group
- **`src/app/(app)/layout.tsx`** — wraps all app pages in `<AppShell>` (Navbar included).
- **`src/app/(app)/feed/page.tsx`** — server component: hero = articles[0], 3 carousels of 3–4 cards each.

## Verification
- `npm run build` — zero TypeScript errors ✓
- `/feed` route generated ✓
