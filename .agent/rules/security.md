---
trigger: model_decision
description: Use when touching authentication, user input, environment variables, external APIs, or any data that could be sensitive.
---

Before implementing any feature in this category, verify each of the following and state which apply:

- **No secrets in code**: API keys, tokens, and credentials must live in `.env.local` (never committed). Reference via `process.env.VARIABLE_NAME` only. If a variable is needed client-side, it must use the `NEXT_PUBLIC_` prefix intentionally and must not be sensitive.
- **Input is never trusted**: Validate and sanitize all user input on the server — never rely on client-side validation alone. Use a schema validation library (e.g., Zod) on Server Actions and API routes.
- **Auth coverage before happy path**: Any route, page, or Server Action that handles user data or mutation must have its auth guard in place before writing the feature logic. Verify middleware or `auth()` coverage explicitly.
- **Supabase RLS is not optional**: Row Level Security must be enabled on every table. Never expose the Supabase service role key to the client. The anon key is the only key that should appear in `NEXT_PUBLIC_` variables.
- **No sensitive data in logs or URLs**: Don't log tokens, passwords, or PII. Don't put sensitive values in query strings or route params.
- **Dependency security**: When adding a package that touches auth or data handling, note its maintenance status and whether it has known vulnerabilities (`npm audit`).

At the end of any task where this rule applies, explicitly state which of the above were checked, and which were not applicable.
