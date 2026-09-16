---
trigger: model_decision
description: Use when writing, reviewing, or discussing tests for this project's behavior.
---

- New behavior (a component, function, or route with logic) should have a test unless explicitly told to skip it.
- Test observable behavior and outcomes, not implementation details — avoid tautological tests.
- When fixing a bug: write a test that would have caught it, confirm it fails before the fix and passes after.
- If there's no test setup yet, say so explicitly and propose one before writing more untested logic.
