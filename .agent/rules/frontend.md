---
trigger: glob
globs: **/*.tsx,**/*.jsx,**/*.css
---

- Keep components small and single-purpose. Split when a component does more than one clear thing.
- Use Tailwind utility classes directly; avoid custom CSS unless Tailwind genuinely can't express it.
- Every interactive element needs a visible focus state and an accessible label (alt text, aria-label, etc.) — don't skip this for speed.
- Handle loading, empty, and error states explicitly for anything that fetches or depends on data — don't just build the happy path.
- Verify responsive behavior at mobile and desktop widths, not just the default viewport.
- Use consistent naming for components/files; if no convention exists yet in the project, propose one before adding more files.