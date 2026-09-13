---
trigger: model_decision
description: Use when making or recommending a significant architectural, library, infrastructure, or data model decision.
---

When a significant decision is made, record it as an Architecture Decision Record (ADR) in `docs/decisions/`.

## What qualifies as significant?
- Choosing a library or service (e.g., Auth.js, Supabase, Zod)
- Defining a data model or schema structure
- Establishing a routing or auth pattern
- Any decision that would be hard to reverse later, or that a new contributor would need to understand to work safely

Trivial decisions (which Tailwind class, which variable name) do not need an ADR.

## File naming
`docs/decisions/NNN-short-kebab-title.md` — increment NNN from the last file (e.g., `001-auth-strategy.md`, `002-database-choice.md`).

## Template

```markdown
# NNN — Title

**Date**: YYYY-MM-DD
**Status**: Accepted | Superseded by NNN | Deprecated

## Context
What problem were we solving? What constraints or requirements shaped this decision?

## Decision
What did we decide, and why is this the right call given the context?

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| ...    | ...         |

## Consequences
- **Makes easier**: ...
- **Makes harder / locks us into**: ...
- **Open risks**: ...
```

If a previous decision is superseded, update its status line and link to the new ADR.
