# CLAUDE.md — Project Instructions for AI Agents

This project has **two codebases** with their own architecture guides. Read the relevant guide BEFORE generating any code.

---

## 1. React App (Admin / Dashboard)

**Stack:** React 19 + TypeScript + Tailwind CSS + Shadcn UI + Zustand + React Query
**Pattern:** Vertical Slicing + Atomic Lite (Container/Presentational) + Adapter Pattern
**Language:** Code in English, UI text in Spanish

### Architecture Guide

**Read first:** [docs/FRONTEND-ARCHITECTURE-GUIDELINES.md](docs/FRONTEND-ARCHITECTURE-GUIDELINES.md)

### Quick Reference

**Directory Structure:**
```
src/
  shared/           # Business-agnostic reusables (ui, layout, hooks, lib, types, helpers, routes)
  features/         # Vertical slices — one folder per domain
    [feature]/
      api/          # One subfolder per endpoint: [endpoint].dto.ts + use[Action].ts
      components/   # Presentational (dumb) components
      containers/   # Smart components (connect hooks → UI)
      interfaces/   # Feature-specific TypeScript interfaces
      models/       # Domain Models (clean, frontend-optimized)
      pages/        # Composition Root (no logic, just layout)
      stores/       # Zustand stores (UI state only)
      hooks/        # Custom hooks (NOT React Query hooks)
      helpers/      # Zod schemas + pure utility functions
      layout/       # Feature-specific layouts
```

**Data Flow:** `API → DTO + Mapper (api/[endpoint]/) → Domain Model (models/) → Container → Component`

**Critical Rules:**
1. No raw HTML tags — Use `Stack`, `Grid`, `Box`, `H1`–`H6`, `P`, `Small`, `Span`.
2. No cross-feature imports — Create local hooks instead.
3. Mutations: `mutate` + callbacks — NEVER `mutateAsync` + `try/catch`.
4. Mappers inside DTO files — Never in separate mapper files.
5. Every endpoint gets a separate `.dto.ts` file.
6. No hardcoded paths — Use path constants (`AuthPath.ROOT`).
7. No `switch/case` or `if-else` — Sequential `if` with early returns.
8. Enums: `as const` + type extraction — Never TS `enum`.
9. Zod: Import from `zod/v4`. Derive types with `z.infer`.
10. No React 19 form hooks — Project uses `react-hook-form`.

**Naming Conventions:**

| Element | Convention | Example |
|---------|-----------|---------|
| Feature folder | `kebab-case` | `user-management/` |
| API subfolder | `kebab-case` | `api/forgot-password/` |
| DTO file | `kebab-case.ts` | `login.dto.ts` |
| Hook file (RQ) | `camelCase.ts` | `useLogin.ts` |
| Component file | `PascalCase.tsx` | `MemberCard.tsx` |
| Container file | `PascalCase.tsx` | `MemberProfileContainer.tsx` |
| Model file | `kebab-case.ts` | `member.model.ts` |
| Store file | `camelCase.ts` | `useMemberStore.ts` |
| Schema file | `kebab-case.ts` | `login.schema.ts` |

**Key Patterns:**
- Zustand stores hold UI state only. Server state → React Query.
- Containers MUST NOT import other containers — Pages orchestrate.
- Loading/error states render inside content area — Don't unmount headers.
- Responsive tables: Desktop `<Table>` + Mobile `<Card>` with labels.
- Extract custom hooks when logic > ~200 lines or 5+ `useMemo`/`useEffect`.
- Shared state components: `PageLoading`, `PageError`, `PageEmpty`, `PageNotFound`.
- Shadcn via `npx shadcn@latest add` — Never create manually.
- Path aliases: `@/shared/...`, `@/features/...`.

**Feature Scaffolding Order:** Model → DTO + Mapper → Hook → Schema → Components → Container → Page

---

## 2. Astro Landing Pages

**Stack:** Astro 5.x + TypeScript + Tailwind CSS v4 + React (Islands) + Three.js / R3F + GSAP + ScrollTrigger
**Pattern:** Static-First + Islands Architecture + SEO-Driven
**Language:** Code in English, UI text in Spanish

### Architecture Guide

**Read first:** [docs/ASTRO-LANDING-ARCHITECTURE-GUIDELINES.md](docs/ASTRO-LANDING-ARCHITECTURE-GUIDELINES.md)

### Quick Reference

**Directory Structure:**
```
src/
  assets/              # Processed images, fonts (Astro optimizes at build)
  components/
    ui/                # Design system atoms (Button, Badge, Card) — .astro, zero JS
    layout/            # Section, Container, Stack, Grid
    seo/               # SEOHead, StructuredData, Breadcrumbs
    animations/        # GSAP wrappers (ScrollReveal, FadeIn, ParallaxLayer)
    three/             # Three.js / R3F scenes (always client:only="react")
    sections/          # Landing page sections (hero/, features/, testimonials/, cta/, etc.)
  layouts/             # Page shells (BaseLayout, LandingLayout)
  pages/               # File-based routing
  content/             # Content Collections (blog, services, testimonials)
  lib/                 # Utilities (animations.ts, constants.ts)
  styles/              # global.css (Tailwind v4 @theme entry)
  content.config.ts    # Zod schemas for content collections
```

**Critical Rules:**
1. **Zero JS by default** — Most sections are `.astro` components with no client directive.
2. **Three.js: `client:only="react"`** — NEVER `client:load` (SSR crashes on WebGL).
3. **GSAP: Initialize in `astro:page-load`** — NEVER `DOMContentLoaded`.
4. **GSAP: Clean up in `astro:before-swap`** — Kill tweens + ScrollTrigger instances.
5. **Respect `prefers-reduced-motion`** — Skip animations, show final state.
6. **Images in `src/assets/`** — Use `<Image>` from `astro:assets`. `loading="eager"` ONLY for hero.
7. **SEOHead on every page** — Unique `title`, `description`, OG image, canonical URL.
8. **JSON-LD on every page** — At minimum Organization schema.
9. **Semantic HTML** — `<section>`, `<article>`, `<nav>`, `<main>`. Never `<div>` where semantic applies.
10. **Tailwind v4 via `@tailwindcss/vite`** — NOT `@astrojs/tailwind`.

**Islands Hydration Strategy:**

| Directive | Use Case |
|-----------|----------|
| _(none)_ | Static content (headers, text, cards) — DEFAULT |
| `client:load` | Critical above-fold interactivity (mobile nav) |
| `client:idle` | Forms, newsletter, chat widgets |
| `client:visible` | Below-fold carousels, charts |
| `client:media="(query)"` | Mobile-only components |
| `client:only="react"` | Three.js / WebGL scenes |

**GSAP Animation Types:**

| Type | Pattern | Use Case |
|------|---------|----------|
| Timeline | `gsap.timeline()` sequenced `.to()` | Hero entrance |
| ScrollReveal | `ScrollTrigger` + `fromTo` | Section entrances |
| Stagger | `stagger: 0.15` on array | Card grids, lists |
| Pinned scrub | `ScrollTrigger: { pin, scrub }` | Process/timeline sections |
| Parallax | `yPercent` + `scrub: true` | Background layers |
| Text split | `SplitText` + char stagger | Headlines (requires GSAP license) |

**Three.js Patterns:**

| Approach | When | Directive |
|----------|------|-----------|
| React Three Fiber | Complex 3D scenes, models, interactions | `client:only="react"` |
| Vanilla Three.js | Simple effects (particles, backgrounds) | `<script>` in `.astro` |

**Performance Targets:**

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |

**Naming Conventions:**

| Element | Convention | Example |
|---------|-----------|---------|
| Page file | `kebab-case.astro` | `about.astro` |
| Layout file | `PascalCase.astro` | `BaseLayout.astro` |
| Astro component | `PascalCase.astro` | `HeroContent.astro` |
| React component | `PascalCase.tsx` | `HeroScene.tsx` |
| Section folder | `kebab-case/` | `sections/hero/` |
| Content collection | `kebab-case/` | `content/blog/` |
| Data attribute | `kebab-case` | `data-reveal-y` |
| CSS variable | `kebab-case` | `--color-primary-500` |

---

## Shared Rules (Both Projects)

- **Code in English, UI text in Spanish.**
- **TypeScript strict** — No `any`. Always provide proper types.
- **Enums:** `as const` + type extraction. Never TS `enum`.
- **Zod** for validation schemas. Derive types with `z.infer`.
- **No `switch/case` or `if-else`** — Sequential `if` with early returns.
- **Tailwind** for layout/spacing. Scoped/module CSS for complex animations.
- **Self-host fonts** — No external font CDNs in production.
- **Images optimized** — WebP/AVIF, responsive sizes, explicit dimensions.
