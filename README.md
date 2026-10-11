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
npm run test:catalog
npm run test:public
npm run test:admin
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
MongoDB at build time. Home retrieves its menu preview directly on the server
at request time. Public catalog reads run on the Node.js runtime with
`force-dynamic` handlers, `Cache-Control: no-store`, and uncached browser requests.
MongoDB connection reuse does not cache query results. Later admin changes will
appear on a fresh request without cache invalidation work.

## Public catalog API

| GET endpoint | Query fields | Public visibility |
| --- | --- | --- |
| `/api/v1/menu-items` | `q`, `category`, `page`, `limit` | Nonarchived dishes; unavailable dishes remain visible |
| `/api/v1/branches` | `q`, `city`, `page`, `limit` | Active, nonarchived branches |

Responses contain `data`, `meta` (`page`, `limit`, `total`, `totalPages`), and
`options` (up to 100 categories or cities from visible records). Lists default
to 12 records per page, capped at 48, with page numbers capped at 1000. Text
queries are at most 80 characters. Search is case-insensitive literal matching,
not raw regex or MongoDB query input. Unsupported/repeated query fields return
400. Database failures return a deliberate 503 message without driver details.
Only explicitly projected public fields are serialized; no write methods exist.

Menu and Branches retrieve these GET endpoints in the browser, providing a
visible API retrieval/display path for grading. Page frames remain server
rendered; database results load on the client with cancellation, retry,
search/filter controls, pagination, and loading/empty/error states. No server
component makes HTTP requests to its own API.

Models declare indexes but disable automatic collection/index creation during
public reads. Create and verify
indexes as part of the future admin/data setup, rather than on a public request.

## Supplied catalog content and seeding

`src/data/catalog.seed.json` contains the seven menu items and four Pampanga
branches supplied in `CHICKEN_JOO_MENU_AND_BRANCH_DATA.md` on October 11, 2026.
These are user-supplied business details, not independently verified restaurant
claims. Product names/categories are proposed website labels. Availability is
for the student demonstration and does not represent live stock.

```bash
npm run seed:catalog
```

This explicit command requires `MONGODB_URI`, `MONGODB_DB_NAME`, network access,
and a database user with read/write permission. It is never run at startup or
during a build. It inserts only missing stable seed keys via `$setOnInsert` and
deterministic IDs. Reruns preserve all fields and timestamps of existing keyed
records, including later admin edits; they never clear collections or overwrite
unrelated records. Partial failures can be rerun safely. Editing the local seed
file does not update existing records: use future admin CRUD for revisions.

To preview the insert/skip counts without writing, invoke:

```bash
node --experimental-strip-types --disable-warning=ExperimentalWarning --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/seed-catalog.mjs --dry-run
```

Chicken flavor options and required counts are stored and displayed as product
information, not separate menu items or ordering controls. Midnight closing
times and following-day flags are retained for later use. Missing phones and
Facebook links remain null, with no corresponding public controls. Supplied
Maps links are preserved; search links are not claimed to be exact place pins.
All menu photos remain blank and show placeholders. Ordering remains disabled.

To check the live APIs, start the app locally on port 3100 and run:

```bash
npm run test:catalog:api
```

For a different local port, set `CATALOG_TEST_ORIGIN` to that local origin for
the test command. These checks read current data and confirm 400/405 responses;
they do not insert/delete records. `test:catalog` covers query validation,
pagination bounds, literal search escaping, and safe local image paths offline.

## Current scope and next inputs

Home uses the supplied menu through direct server reads, replacing the previous
unverified promotion and sample prices. Menu and Branches are API-backed and
include search/filter and loading/empty/error states. Our Story introduces the
brand using supplied copy and four strengths with image placeholders. Blog /
Updates lists published articles and provides direct article pages. Contact
reuses the branch records and accepts student-project inquiries. Ordering controls are disabled.
The existing `public/email.html` mockup is retained for later review.

Admin sign-in and content management are implemented at `/admin/login` and
`/admin`, with menu/branch/post editing and inquiry review/resolution. The next
increment adds simulated ordering and admin order statuses. Confirmation access
will be settled before checkout implementation. Inquiry details are collected
only when someone submits the Contact form. No customer-order data is seeded.
See [content inputs](docs/content-inputs.md) for the content checklist.

Menu and branch text content is now supplied. Outstanding inputs include food
photos, general contact details, original Facebook post links, and campaign dates/terms.
See [admin setup](docs/admin-setup.md) for seed credentials, opaque database sessions,
index creation, protected APIs and verification. Hosting configuration can wait until deployment is planned; choose
a Node.js runtime with MongoDB connectivity and keep all database/auth secrets
server-only, without a `NEXT_PUBLIC_` prefix.

## Public content and inquiries

`CHICKEN_JOO_PUBLIC_CONTENT.md` supplies the brand introduction and three short
updates. The dates/captions are user supplied, not independently verified.
Posts store publication dates as `YYYY-MM-DD` calendar strings, without invented
times. Public list, direct slug lookup, and metadata use the same published-only
filter; drafts, missing dates, and future dates are excluded. Paragraphs render
as escaped text, not HTML. Missing photos use placeholders and missing source
URLs have no link buttons. These articles do not establish voucher campaigns.

```bash
npm run seed:posts
```

This explicit insert-only command loads `src/data/posts.seed.json`. Stable keys,
slugs and deterministic IDs prevent repeat inserts for the maintained content.
Existing records and admin edits are preserved. Use `--dry-run` with the script
directly to preview counts. Automatic index creation remains disabled; unique
slug and visibility indexes are created explicitly by `npm run setup:admin`.

Review inquiries through the protected admin dashboard. No inquiry review API
is exposed publicly.

`POST /api/v1/inquiries` accepts JSON with name, email, subject, message, a blank
honeypot `website`, and a UUID-v4 `submissionId`. It validates field lengths/types,
bounds the actual request stream to 16 KiB, and requires a same-origin request.
The server sets timestamps/status. Opaque submission IDs make unchanged retries
safe through MongoDB's `_id` uniqueness. Responses contain a receipt message only;
there is no public inquiry GET endpoint. The form retains values on failure and
provides linked error summaries, inline errors, and pending/success feedback.
Messages are saved in `inquiries`; no email is sent and Chicken Joo does not
receive them. Existing database read/write access is sufficient, with no new
environment variables or mail service needed.

Basic abuse controls include a honeypot and a database-backed limit of three
inquiries per normalized email in ten minutes. This is a student-demo guard,
not a comprehensive spam defense: it can be bypassed with different emails and
concurrent requests can race. Before public deployment, add an atomic rate limiter
at the hosting boundary and configure trusted proxy/origin handling for that host.
Inquiry review routes require an active admin session on every request.

With the local production app on port 3100:

```bash
npm run test:public:api
```

`PUBLIC_TEST_ORIGIN` can select a different localhost port. The integration check
inserts isolated draft/future posts and temporary inquiry records, verifies
privacy/validation/storage/retry/limits, and removes only its exact fixture IDs.
It requires database write access. Offline `test:public` checks inquiry validation,
calendar dates, and supplied seed content.
