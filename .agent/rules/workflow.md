---
trigger: always_on
---

- Follow this order for any non-trivial feature: requirements → design/structure → implementation → test. Do not skip ahead to code before design is confirmed.
- Use Planning Mode for anything beyond a one-line fix.
- One feature or logical step per task. If a request bundles multiple unrelated changes, say so and propose splitting it.
- If a request is ambiguous, ask a clarifying question rather than assuming — batch all needed questions into one pass.
- State assumptions explicitly when one is unavoidable.
- Match effort to the decision's weight: a one-line fix gets a one-line reason; an architectural choice gets a real explanation.
- Don't re-read, re-summarize, or restate files/context that haven't changed since earlier in this task.
- Don't explore files or context speculatively unless actually relevant to the current task.
- When a plan has multiple steps, implement one step, then stop and summarize before continuing to the next. Do not execute a whole multi-step plan end-to-end after a single approval — each step needs its own checkpoint.
- When showing changes, show the diff or relevant excerpt — not the full file — unless it's brand new or explicitly requested whole.
- At the end of every non-trivial task, or each step's checkpoint, provide:
  - **Changed**: what changed, and why.
  - **Not tested / risks**: what wasn't verified, and why it matters.
  - **Assumptions**: anything assumed without explicit confirmation.
  - **Next step**: the single most logical next action.
- Prefer small, reviewable diffs over large one-shot rewrites.
