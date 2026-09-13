---
trigger: model_decision
description: Use when discussing build, deployment, hosting, or production readiness.
---

- Target platform: Vercel, unless stated otherwise for a specific project.
- Before recommending deployment, confirm: production build succeeds, required environment variables are set, and no secrets are committed to the repo.
- Never claim a deployment is verified without an actual check — state clearly what was and wasn't confirmed.