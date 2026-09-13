---
trigger: always_on
---

- Follow this order for any non-trivial feature: requirements → design/structure → implementation → test. Do not skip ahead to code before design is confirmed.
- Use Planning Mode for anything beyond a one-line fix.
- One feature or logical step per task. If a request bundles multiple unrelated changes, say so and propose splitting it.
- If a request is ambiguous, ask a clarifying question rather than assuming.
- State assumptions explicitly when one is unavoidable.
- At the end of every non-trivial task, provide a structured summary with these exact fields:
  - **Changed**: What files and behavior changed, and why.
  - **Not tested / risks**: What was not verified, and why it's a risk worth tracking.
  - **Assumptions**: Any assumptions made that the user didn't explicitly confirm.
  - **Next step**: The single most logical next action — be specific, not generic.
- Prefer small, reviewable diffs over large one-shot rewrites.