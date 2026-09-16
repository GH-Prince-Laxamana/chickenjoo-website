---
trigger: model_decision
description: Use when touching authentication, user input, environment variables, external APIs, or any data that could be sensitive.
---

Before implementing any feature in this category, verify each of the following and state which apply:

- **No secrets in code**: credentials live in `.env.local`, never committed. Reference via `process.env.VARIABLE_NAME`. Client-exposed variables must use the appropriate public prefix intentionally, and must not be sensitive.
- **Input is never trusted**: validate and sanitize all user input server-side — never rely on client-side validation alone.
- **Auth coverage before happy path**: any route or action handling user data or mutation must have its auth guard in place before the feature logic is written.
- **No sensitive data in logs or URLs**: don't log tokens/passwords/PII; don't put sensitive values in query strings.
- **Dependency security**: note a new package's maintenance status if it touches auth or data handling.

At the end of any task where this applies, state which of the above were checked and which weren't applicable. Add database- or infra-specific checks (e.g. row-level security) here once that infrastructure is actually chosen — not before.
