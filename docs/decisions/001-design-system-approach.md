# 001 — Design System Approach

**Date**: 2026-09-14
**Status**: Accepted

## Context

ChickenJoo needs a foundational design system to ensure consistency across the application. The project uses Tailwind CSS v4, which introduced breaking changes compared to v3 (notably the removal of `tailwind.config.ts`). We also needed to establish conventions for shared layout components.

## Decision

1.  **Tailwind v4 `@theme inline`:** We opted to define all design tokens (colors, fonts, spacing) directly in `src/app/globals.css` using the new `@theme inline` directive, adhering to Tailwind v4 conventions.
2.  **Custom Shared Chrome (Header/Footer):** Instead of using a heavy component library (like shadcn/ui or MUI) for basic structural components, we built custom `Header` and `Footer` components.
    - The `Header` is a Client Component (`"use client"`) to support the mobile drawer and active link state (via `usePathname`).
    - The `Footer` remains a Server Component for better performance.
3.  **Google Fonts Integration:** We used `next/font/google` to import 'Outfit' for headings and 'Inter' for body text, exposing them as CSS variables to integrate seamlessly with the Tailwind setup.

## Alternatives considered

| Option                                     | Why rejected                                                                                                                                                                                                   |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component Library (e.g., shadcn/ui, Radix) | Overkill for the initial requirements. We want a highly tailored, branded look (red/blue/white) that might be more difficult to customize cleanly than starting from scratch with utility classes.             |
| Server Component Header                    | Implementing the mobile hamburger menu without client-side state is difficult and often requires convoluted CSS hacks. Making it a Client Component is a reasonable tradeoff for the interactive requirements. |

## Consequences

- **Makes easier**: Applying consistent branding across the site. The CSS variables are globally available.
- **Makes harder / locks us into**: We are heavily relying on the Tailwind v4 styling paradigm.
- **Open risks**: The current Header is a Client Component, which slightly increases the client bundle size on initial load, but the impact is negligible.
