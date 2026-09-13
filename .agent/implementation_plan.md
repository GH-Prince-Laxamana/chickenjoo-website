# Phase 1 — Project Scaffold & Design System

## Goal

Set up the visual and structural foundation that every subsequent page will build on.
No feature logic. No real content. The output is: open any future page and it already
looks like ChickenJoo, not a Next.js starter.

**Primary outcome**: a design system in code — brand colors, typography, spacing, and
the two shared chrome components (Header, Footer) — that any developer on this project
can use immediately.

---

## Tailwind v4 — Important Context

> [!IMPORTANT]
> This project uses **Tailwind CSS v4**, which is a breaking change from v3.
> There is **no `tailwind.config.ts`** in v4. All theme customization is done via
> CSS `@theme` blocks in `globals.css`. Any v3 patterns (e.g., `theme.extend.colors`
> in a config file) will silently not work.

The existing `globals.css` already uses the v4 `@theme inline` syntax. We will extend it.

---

## Open Questions

> [!IMPORTANT]
> **Typography**: The current scaffold uses `Geist` (Next.js's own font). I recommend
> replacing it with a Google Font that better fits the Korean restaurant brand.
> My recommendation: **Outfit** (modern, rounded, warm) for headings + **Inter** (clean,
> readable) for body text. Both are variable fonts — zero layout shift, no extra weight cost.
> Do you want to approve this, or do you have a preferred font?

> [!NOTE]
> If you have no preference, I'll proceed with Outfit + Inter and you can adjust later.
> The font choice is easy to reverse at this stage.

---

## Proposed Changes

### 1. Design Tokens — `src/app/globals.css`

#### [MODIFY] [`globals.css`](file:///c:/Users/Prince/Desktop/Projects/chickenjoo-website/src/app/globals.css)

Replace the placeholder color tokens with the ChickenJoo brand palette and add
typographic and spacing scale tokens using Tailwind v4's `@theme` block.

**What changes:**

- `--color-blue`, `--color-red`, `--color-steel`, `--color-white` from the confirmed hex codes
- Semantic aliases: `--color-primary` (red), `--color-surface` (white), `--color-text` (blue)
- Remove the dark mode auto-flip (ChickenJoo is a light-mode brand — warm white background)
- Font family variables pointing to the two loaded fonts
- A base `body` style using brand color tokens

---

### 2. Typography — `src/app/layout.tsx`

#### [MODIFY] [`layout.tsx`](file:///c:/Users/Prince/Desktop/Projects/chickenjoo-website/src/app/layout.tsx)

Replace `Geist` / `Geist_Mono` with brand fonts via `next/font/google`.

**What changes:**

- Import `Outfit` (headings) and `Inter` (body) from `next/font/google`
- Both as variable fonts with `display: 'swap'` for performance
- Expose as CSS variables (`--font-heading`, `--font-body`) for use in Tailwind
- Update `<html>` metadata: title → "ChickenJoo", description → restaurant tagline
- Language stays `lang="en"` (assumption: English-primary site, revisit if Tagalog/Korean needed)

---

### 3. Shared Components

#### [NEW] `src/components/layout/Header.tsx`

The primary navigation. This component:

- Renders the ChickenJoo logo (text-based placeholder — no image asset needed yet)
- Navigation links: Home, Menu, Blog, About, Contact — using `next/link`
- Mobile: hamburger menu with a slide-in drawer (CSS transition, no JS library)
- Desktop: horizontal nav with hover states using brand colors
- Active link state using `usePathname()` from `next/navigation` — **makes this a Client Component** (`"use client"`)
- Sticky at top, with a subtle drop shadow on scroll

> [!NOTE]
> The mobile drawer makes `Header` a Client Component. This is the correct tradeoff —
> the alternative (a Server Component header) would require a separate client wrapper
> just for the mobile toggle, which adds complexity for no real benefit at this scale.

#### [NEW] `src/components/layout/Footer.tsx`

A simple server component (no interactivity needed). Contains:

- Logo + short tagline
- Navigation link groups (Quick Links, Contact info)
- Copyright line
- Brand color background (`blue`)

#### [NEW] `src/components/layout/index.ts`

Barrel export for clean imports: `import { Header, Footer } from "@/components/layout"`.

---

### 4. Root Layout Update — `src/app/layout.tsx`

Wire `Header` and `Footer` into the root layout so every page inherits them automatically.

```
<html>
  <body>
    <Header />
    <main>{children}</main>
    <Footer />
  </body>
</html>
```

---

### 5. Placeholder Homepage — `src/app/page.tsx`

Replace the generated Next.js starter page with a **minimal placeholder** that:

- Has a centered "Coming Soon" hero section using brand colors
- Proves the design system is working (font, colors, header, footer all visible)
- **Not the real homepage** — that's Phase 2

---

### 6. Naming Convention (locking in now, per `frontend.md`)

| Type              | Convention         | Example                                          |
| ----------------- | ------------------ | ------------------------------------------------ |
| Components        | `PascalCase.tsx`   | `Header.tsx`, `MenuCard.tsx`                     |
| Component folders | `lowercase`        | `src/components/layout/`, `src/components/menu/` |
| Data files        | `camelCase.ts`     | `src/data/menuItems.ts`                          |
| Type files        | `camelCase.ts`     | `src/types/menu.ts`                              |
| Page routes       | Next.js convention | `src/app/menu/page.tsx`                          |
| Barrel exports    | `index.ts`         | `src/components/layout/index.ts`                 |

---

## Architecture Decision to Record

Per `decisions.md`, this phase triggers one ADR:

**`docs/decisions/001-design-system-approach.md`** — documenting why we use Tailwind v4
CSS variables for theming instead of a component library (e.g., shadcn/ui), and why we're
building Header/Footer as custom components rather than pulling in a UI kit.

---

## Verification Plan

### Automated

- `npm run build` — confirms no TypeScript errors and no broken imports
- `npm run lint` — confirms ESLint passes

### Manual

- Dev server running, visit `http://localhost:3000`
- Header visible at mobile (375px) and desktop (1280px) widths
- Mobile hamburger opens/closes correctly
- Footer renders at bottom of page
- Brand colors, fonts, and spacing are applied correctly
- No flash of unstyled content (fonts loaded via `next/font`)

---

## What this phase does NOT include

- Real homepage content (Phase 2)
- Any page beyond the placeholder
- Any data fetching
- Any CMS or admin logic
- Test setup (flagged: **no test setup exists** — will propose Vitest + React Testing Library before Phase 3, when components with real logic are introduced)
