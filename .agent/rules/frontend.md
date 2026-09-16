---
trigger: glob
globs: **/*.tsx,**/*.jsx,**/*.css
---

- Keep components small and single-purpose. Split when a component does more than one clear thing.
- Use Tailwind utility classes directly; avoid custom CSS unless Tailwind genuinely can't express it.
- Every interactive element needs a visible focus state and an accessible label — don't skip this for speed.
- Handle loading, empty, and error states explicitly for anything that fetches or depends on data.
- Verify responsive behavior at mobile and desktop widths, not just the default viewport.
- Use consistent naming for components/files; if no convention exists yet, propose one before adding more.
