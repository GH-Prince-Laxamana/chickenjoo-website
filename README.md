# Chicken Joo
A digital experience that reimagines Chicken Joo's online presence through modern UI/UX design, integrated marketing campaigns, content management, and interactive restaurant services.

Built with Next.js App Router, TypeScript, Tailwind CSS 4, and MongoDB (Mongoose), the platform features a content management system (CMS), an administrative dashboard, customer accounts, a searchable menu and branch locator, and simulated pickup ordering with order tracking and promotional vouchers.

The project demonstrates how a unified digital platform can strengthen brand identity, streamline restaurant operations, and improve customer engagement.

Disclaimer: This is an academic demonstration and is currently not affiliated with or operated by Chicken Joo. Orders, promotions, and administrative workflows are simulated. No actual payments, food preparation, or pickup fulfillment take place.

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

To let another device on the same network open the development site, start it
with the LAN binding instead:

```bash
npm run dev:network
```

Find the host computer's private IPv4 address with `ipconfig`, then have the
other device open `http://<host-ip>:3000`. Windows Firewall must allow inbound
TCP traffic for Node.js on the selected network profile. The other device does
not need your `.env.local`: browser requests go to the host computer, and only
the host's server process connects to MongoDB. If the page opens but Menu,
Branches, Contact, or checkout requests return 503, run `npm run db:check` on
the host computer; that is a server/database configuration problem, not a
browser-device problem.

### Sharing the project and diagnosing local 503 errors

Real `.env` files stay ignored; `.env.example`, `package-lock.json`, source,
assets, and maintained `tools/` commands belong in Git. Pull the latest changes,
use Node.js 22.17 or newer, and run `npm ci` in the folder containing `package.json`.
Place the privately shared database settings in `.env.local` in that same folder.
Both `MONGODB_URI` and `MONGODB_DB_NAME` must be set. Admin seed settings are not
needed to display Menu or Branches.

If Menu and Branches return 503, run `npm run db:check` before starting the server.
This is a read-only connection/ping check. Share only its sanitized output, never
the connection URI or environment file. Public API 503 responses deliberately
hide database details, so the HTTP status alone does not identify the cause.

- If configuration is missing, check the filename is not `.env.local.txt` and the
  file is beside `package.json`, not inside `src/`. Restart `npm run dev`.
- Existing shell variables and `.env.development.local` override `.env.local`;
  `.env.local` and `.env.development` override `.env` during development. A stale
  higher-priority setting can override the file that was shared.
- If connection/ping fails, verify the Atlas **database user** and password,
  selected cluster, database permissions, and URI credential encoding. Allowing
  public IP access does not bypass authentication or the friend's network's DNS,
  firewall, or outbound MongoDB-port restrictions. A different network can help
  isolate a network-specific failure.
- If ping passes but catalog requests still fail, confirm the database user can
  read the selected database and check the server terminal. Ping alone does not
  establish collection permissions. Missing seed records normally produce empty
  lists rather than 503; do not reseed a shared database to diagnose connectivity.

For a deployed copy, configure environment variables on the hosting service;
local ignored files are not automatically included in Git deployments.

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
node --experimental-strip-types --disable-warning=ExperimentalWarning --disable-warning=MODULE_TYPELESS_PACKAGE_JSON tools/seed-catalog.mjs --dry-run
```

Chicken flavor options and required counts are stored and displayed as product
information, with distinct flavor choices required before adding to the demo cart. Midnight closing
times and following-day flags are retained for later use. Missing phones and
Facebook links remain null, with no corresponding public controls. Supplied
Maps links are preserved; search links are not claimed to be exact place pins.
All menu photos remain blank and show placeholders. Simulated pickup ordering is available; no payment or food preparation takes place.

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
brand using supplied copy and four strengths with image placeholders. News /
Updates lists published articles and provides direct article pages. Contact
reuses the branch records and accepts student-project inquiries. Demo cart and pickup checkout are available.
The existing `public/email.html` mockup is retained for later review.

Admin sign-in and content management are implemented at `/admin/login` and
`/admin`, with menu/branch/post editing and inquiry review/resolution. Simulated
pickup ordering and admin order statuses are implemented. Private confirmation
uses an account session and a browser-tab receipt token. Inquiry details are collected
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

If an existing database was seeded before the image folders were reorganized,
preview and then apply the exact blog and campaign path updates with:

```bash
npm run db:migrate-image-paths
npm run db:migrate-image-paths:apply
```

The migration updates only known old paths in `blogPosts`; it does not replace
images, rewrite other fields, or touch unrelated records.

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



## Simulated pickup ordering

The website-launch campaign is maintained in `src/data/launch-campaign.json`.
Run `npm run seed:campaign` to publish it on a new database or update its exact
legacy browser-voucher terms. During September 15–October 15, 2026 (Philippine
time), checkout requests a server-calculated 25% total-order discount for eligible
customer accounts. A unique partial MongoDB index on customer and campaign makes
the successful order insert the redemption, including under concurrent requests.
Changing browsers or clearing storage does not reset it. Cancellation does not
restore a redeemed voucher. Other accounts have independent voucher eligibility.

Public browsing remains open. Adding a meal requires registration or login at
`/register` or `/login`; the chosen meal, flavors, and quantity are restored after
sign-in. `/cart`, `/checkout`, `/confirmation`, and `/account` require a customer
session. Carts use separate browser-storage keys per account. Checkout takes the
customer name/email from the server session, rejecting client-supplied identity.
No payment, delivery, food preparation, pickup reservation, or confirmation email
is provided. Existing guest orders remain visible to administrators and are not
assigned to new accounts based on an unverified email match.

Checkout first fetches a current server quote. The server validates active,
unarchived branches and available, unarchived dishes; exact distinct flavor
counts; positive integer quantities (1–10 per line, at most 20 lines/50 items);
and account authorization. Totals are computed in integer centavos from MongoDB.
Changed prices or branch details return a fresh quote with HTTP 409 and require
another explicit submit. Availability failures preserve the cart for editing.
Saved menu/branch snapshots preserve order history after content edits/archive.

A UUID submission key, payload fingerprint and MongoDB `_id` uniqueness make
unchanged repeated/concurrent submissions return the same order. Retry metadata
contains a payload hash, not customer details, in sessionStorage. An opaque 256-bit
receipt capability is stored in the browser tab before submitting; only its hash
is saved in MongoDB. Receipt lookup requires the owning account and a same-origin
POST with that token, expires after 24 hours, and excludes customer name/email.
There is no public order list or lookup by reference. Tokens are never placed in
URLs. The latest private
receipt can be recovered from checkout after a lost response. Receipt expiration
does not delete the saved order. Preserve the tab to retain receipt access.

`/admin/orders` lists private order details with status filters and pagination.
Authenticated same-origin PATCH requests enforce pending → preparing → ready →
completed, with cancellation from any nonterminal status. Completed/cancelled
orders are final. Updates match the expected current status to reject stale edits.
No create/delete actions are exposed through admin order management.

Run `npm run setup:admin` to create the declared order/reference/token/status
indexes and the submission-limit TTL index. Existing MongoDB and admin seed
configuration is sufficient. Setup preserves the existing account/password.
The persistent limit permits at most five new submissions per customer account
per 15-minute window; unchanged saved-order retries bypass it.

## Customer accounts and security

Customer records contain name, normalized unique email, a hidden salted scrypt
password hash, active status, and timestamps. Passwords require 16–256 characters.
Customer and admin sessions are separate opaque 256-bit tokens; only hashes are
stored in MongoDB. Cookies are HttpOnly, SameSite=Strict, and Secure with __Host-
names in production. Sessions expire after eight hours, rotate at login, revoke
at logout, and check account active status on every protected request.

Authentication requests have persistent per-email throttling and an additional
trusted-IP limit. Set `AUTH_TRUSTED_IP_HEADER` only to a header your hosting proxy
overwrites. Without it, a conservative shared limit of 100 authentication attempts
per endpoint per 15 minutes also applies. Set `APP_ORIGIN` to the exact production
origin for CSRF checks behind a proxy. Forwarded host headers cannot change the
allowed origin. Responses use no-store for private data; global security headers
prevent third-party framing and disable unsafe embedded objects.

`npm run setup:admin` creates account, session, and voucher indexes while preserving
the existing admin. Required account indexes are also ensured before registration,
sign-in, and order pricing; the database role needs createIndex permission.
Admin accounts are provisioned through the existing local setup command. There
is no administrator registration page or API. Customer forms are white; the admin
sign-in card is navy on a white page. Authentication screens share the public
site's centered 1280px container and 16px mobile / 32px desktop gutters.
Desktop intro and form columns fill the site's content margins with a 48px gap.
Intro headings align to the top of the wider form and scale to 72px on desktop, without
repeated logos or intro taglines.

`/admin/customers` is an admin-only searchable, paginated customer table. Individual
profiles show account details, voucher use, completed-order totals, and paginated
order history. Each account-backed order has a customer link icon; historical
guest orders retain a Guest label. Customer profiles link back to filtered Orders.

Email verification, password recovery, and MFA are not implemented. An account
does not establish a verified real-world identity; vouchers are one per account.

```bash
npm run test:auth
npm run test:auth:api
```

The auth API check uses local port 3100 (override with `AUTH_TEST_ORIGIN`) and
isolated temporary fixtures. It covers account races, role injection, session
rotation/revocation, account isolation, CSRF, throttling, concurrent voucher use,
and private customer information. It removes only its own records.

```bash
npm run test:orders
npm run test:orders:api
```

The API check expects a local production preview on port 3100 (override with
`ORDERS_TEST_ORIGIN`) and uses isolated temporary records. It checks server prices,
flavors, inactive content, price review, concurrent duplicate submission, snapshot
history, capability privacy/expiry, protected admin transitions and submission
limits, then removes only its own fixtures.

Maintained seed, setup and verification commands now live in `tools/` and are
versioned. The entire `scripts/` directory is ignored for local scratch work.
Package commands retain their names; run them through npm as before. Catalog
checks were also moved from the ignored `tests/` folder so a clean clone contains
all documented verification commands.

## Menu visual checkpoint

Shared tokens follow the supplied pale-blue, navy, red and yellow references. Menu uses a compact header, category pills, one presentation highlight and a flat two-column catalog on mobile. Desktop uses bounded three-column catalog sections. Seven confirmed items and their configured flavors remain driven by the existing API. Transparent food photos are missing; labeled spaces preserve their intended placement. Cart controls expand on demand; demo ordering behavior is unchanged. Other page redesigns and curated reviews are deferred to separate increments.
