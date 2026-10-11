# Chicken Joo

A student restaurant website demonstration built with Next.js App Router,
TypeScript, Tailwind CSS 4, and Mongoose. This is not an official restaurant
ordering channel. No payment or food preparation takes place.

## Local setup

- Use Node.js 22.17 or newer and npm. The `db:check` command uses Node's built-in
  TypeScript stripping; Next.js and Mongoose themselves support older Node versions.
- Run `npm ci` to install the versions in `package-lock.json`.
- Copy `.env.example` to `.env.local`, or add its variables to your existing `.env`.
  Both real environment files are ignored. Never commit credentials or paste them
  into chat.

```dotenv
MONGODB_URI=<your local MongoDB or Atlas connection URI>
MONGODB_DB_NAME=chickenjoo
```

For Atlas, configure a database user with access to the selected database and
allow your development machine's IP in Network Access. URL-encode special
characters in URI credentials. An empty cluster is sufficient: MongoDB creates
the database on the first write. The smoke check only connects and pings; it
does not create collections or seed records.

```bash
npm run dev
```

Open http://localhost:3000. The informational pages can run without MongoDB;
database configuration is validated when the connection helper is called.
Restart the development server after changing environment variables.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
npm run db:check
```

The database check loads environment files using Next.js's loader in development
mode (including `.env.local` and `.env`). It requires both variables and exits
unsuccessfully for missing configuration or connection failure. It never prints
the URI or underlying driver errors. If it fails, inspect your credentials,
Atlas permissions, and network configuration locally.

Production builds currently download Fredoka and Inter through `next/font/google`;
the build machine needs access to Google Fonts. `next build` does not replace
the explicit lint check.

## Foundation structure

- `src/app/layout.tsx`: root document, fonts, and default metadata.
- `src/app/(public)`: shared public layout and the six public routes. The route
  group keeps this shell separate from a future admin layout without changing URLs.
- `src/components/SiteHeader.tsx` and `SiteFooter.tsx`: responsive navigation,
  current-page indication, keyboard focus, and demo context.
- `src/lib/db.ts`: server-only entry point for application database access.
  Import `connectDatabase` from `@/lib/db` in future server components or handlers.
- `src/lib/db/connection.ts`: connection core shared with the local CLI check.
  Do not import it into UI components; use the protected entry point above.
  Connections and in-flight attempts are shared across requests and hot reloads;
  failed attempts can retry. Database failures expose deliberate messages only.

No public database health endpoint is provided. The shell does not connect to
MongoDB at build time. Public data caching will be chosen explicitly when data
queries are introduced; there are no cached database reads in this increment.

## Current scope and next inputs

Home retains the existing campaign artwork and sample menu, with unverified
promotion and price labeling. Our Story, Menu, Branches, Blog / Updates, and
Contact are clearly identified placeholders. Ordering controls are disabled.
The existing `public/email.html` mockup is retained for later review.

Next increments add real public retrieval/display, admin authentication and
content management, then simulated ordering. Collection schemas, API contracts,
admin credentials/session mechanism, and confirmation access are not implemented
in this foundation. No customer data is seeded or collected.

Before real content work, supply verified menu prices/categories, branch and
contact details, brand story, food photos, and campaign dates/terms/social links.
Before admin work, select the session mechanism and configure its credentials
and secrets. Hosting configuration can wait until deployment is planned; choose
a Node.js runtime with MongoDB connectivity and keep all database/auth secrets
server-only, without a `NEXT_PUBLIC_` prefix.
