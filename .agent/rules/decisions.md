---
trigger: model_decision
description: Use when making or recommending a significant architectural, library, infrastructure, or data model decision.
---

When a significant decision is made, record it as an ADR in `docs/decisions/`.

## What qualifies as significant?
- A decision that would take real rework to reverse later (data model/schema shape, auth pattern, routing structure)
- Choosing between genuinely competing libraries/services where the choice has lasting consequences
- Anything a future contributor (including future-you) would need to understand to safely change the system

When unsure, ask rather than default to writing one.

## File naming
docs/decisions/NNN-short-kebab-title.md — increment NNN from the last file.

## Template

# NNN — Title
**Date**: YYYY-MM-DD | **Status**: Accepted | Superseded by NNN | Deprecated

**Decision**: What was decided, in 1-2 sentences.
**Why**: The reasoning, briefly.
**Alternative considered**: The next-best option and why it lost (one line, unless 3+ real contenders).
**Risk/tradeoff**: What this makes harder or what to watch for.

If a previous decision is superseded, update its status line and link to the new ADR.
