---
plan: "01-01"
phase: "01-foundation"
status: completed
completed_at: 2026-02-20
---

# Summary: 01-01 — Next.js Scaffold + Japandi Calm Tech Design System

## What Was Built

### Project Scaffold
- **Next.js 16.1.6** (latest, App Router, `src/` dir, TypeScript strict mode)
- **Tailwind CSS v4** — uses `@theme inline` CSS-based config (no `tailwind.config.ts` — this is the v4 pattern)
- **PostCSS** configured with `@tailwindcss/postcss`
- Root `page.tsx` redirects to `/login` via `next/navigation`

### Design System — Japandi Calm Tech
- **`src/styles/tokens.css`** — Full Japandi Calm Tech token set as CSS custom properties:
  - Washi Paper neutrals: `--color-washi-50` through `--color-washi-900`
  - Sage accent: `--color-sage-300` through `--color-sage-600`
  - Semantic tokens: `--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-border`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-accent`, `--color-accent-hover`, `--color-focus-ring`
  - Motion tokens: `--duration-base: 200ms`, `--ease-base: cubic-bezier(0.4, 0, 0.2, 1)` (calm tech — no bounce)
  - Dark mode layer under `[data-theme="dark"]`
- **`src/styles/globals.css`** — imports tokens, exposes them to Tailwind via `@theme inline`, sets base body/heading/focus styles
- **`src/app/globals.css`** — single-line import of `../styles/globals.css`

### Fonts
- **Cormorant Garamond** loaded via `next/font/google` as `--font-cormorant` (weights 300–700, normal + italic)
- **DM Sans** loaded via `next/font/google` as `--font-dm-sans` (weights 300–700)
- Applied as CSS variables in `src/app/layout.tsx`; `--font-display` and `--font-ui` reference them

### Dependencies Installed
- `@phosphor-icons/react` ^2.1.10
- `clsx` ^2.1.1
- `tailwind-merge` ^3.5.0

### Layout Components
- **`src/components/layout/Navbar.tsx`** — sticky top nav with CULTX wordmark in Cormorant Garamond, backdrop blur
- **`src/components/layout/AppShell.tsx`** — page wrapper with optional Navbar slot, `showNav` prop defaults true

### UI Primitives
- **`src/components/ui/Button.tsx`** — `primary` / `secondary` / `ghost` variants; `sm` / `md` / `lg` sizes; token-based colors; WCAG-compliant focus ring
- **`src/components/ui/Input.tsx`** — token-based border/bg/text; focus state with sage accent ring
- **`src/components/ui/Card.tsx`** — rounded surface with `--shadow-sm`, token border

### Utilities
- **`src/lib/utils.ts`** — `cn()` helper using clsx + tailwind-merge

### Constants
- **`src/lib/constants.ts`** — typed enums: `CULTURAL_INTERESTS`, `PROFILE_TYPES`, `REGIONS`, `EXPLORATION_MODES`, `LOCAL_STORAGE_KEYS`

## Verification
- `npm run build` — completed with zero TypeScript errors ✓
- Compiled successfully in 1560ms (Turbopack) ✓
- All route pages generated ✓

## Adaptation Notes
- **Tailwind v4 (not v3)**: The scaffold installed Tailwind v4 which uses CSS-based configuration via `@theme inline` instead of `tailwind.config.ts`. The plan's intent (tokens wired to Tailwind theme) is fully satisfied — tokens are exposed as Tailwind utility classes through the CSS theme block.
- Build output confirms zero errors under strict TypeScript.

## Files Created/Modified
| File | Status |
|------|--------|
| `package.json` | modified (name → cultx) |
| `tsconfig.json` | scaffolded (strict: true) |
| `next.config.ts` | scaffolded |
| `postcss.config.mjs` | scaffolded |
| `src/styles/tokens.css` | created |
| `src/styles/globals.css` | created |
| `src/app/globals.css` | modified |
| `src/app/layout.tsx` | modified |
| `src/app/page.tsx` | modified |
| `src/components/ui/Button.tsx` | created |
| `src/components/ui/Input.tsx` | created |
| `src/components/ui/Card.tsx` | created |
| `src/components/layout/AppShell.tsx` | created |
| `src/components/layout/Navbar.tsx` | created |
| `src/lib/constants.ts` | created |
| `src/lib/utils.ts` | created |
