# Supplied public content inputs

Initial text content was supplied in `CHICKEN_JOO_MENU_AND_BRANCH_DATA.md` on
October 11, 2026: seven products and four branches. It has not been independently
verified, and the website names/categories are proposed labels. This increment
includes explicit insert-only seeding and public read endpoints. Use the
checklists below when verifying or revising details. Food photos can be supplied
later; current cards show placeholders. Demonstration availability is not live stock.

## Menu

| Field | What to supply |
| --- | --- |
| Name | Exact dish name |
| Description | Verified description, including portions where relevant |
| Category | A consistent category name |
| Price | Regular peso price; mark promotional prices separately with confirmed terms |
| Availability | Whether the dish is currently on the menu and orderable |
| Image | Supplied food photo; optional initially |
| Featured | Whether it should appear in a future featured section |

Prices are stored as integer centavos. For arithmetic illustration only, a
price of PHP 100.50 becomes `10050`; this is not a restaurant price claim.
Do not derive the regular menu from the existing unverified campaign mockup.

The `menuItems` collection uses `name`, `description`, `category`,
`priceCentavos`, `image`, `isAvailable`, `isArchived`, `isFeatured`,
`flavorOptions`, and `requiredFlavorCount`. Seeded records also have `seedKey`.
Images currently use local paths such as `/images/<supplied-filename>.webp`;
supported extensions are jpg/jpeg/png/webp/avif. No upload or remote image
hosting configuration is needed for this increment. Missing/broken photos
display a placeholder. Unavailable dishes stay visible; archived dishes do not.

## Branches

| Field | What to supply |
| --- | --- |
| Name | Official branch name |
| Address | Complete street/building address |
| City | City name |
| Hours | Verified hours, with day-specific differences if relevant |
| Phone and email | Branch-specific contact details, if available |
| Directions | Supplied Maps URL; both place links and search links are supported |
| Active | Whether the branch is currently operating |

The `branches` collection uses `name`, `address`, `city`, `province`,
`businessHours`, `openingTime`, `closingTime`, `closesNextDay`, `phone`, `email`,
`mapsUrl`, `facebookUrl`, `isActive`, and `isArchived`. Seeded records also have
`seedKey`. We show the supplied readable hours without inferring whether a
branch is currently open. Unknown contact fields stay null. Public reads
require `isActive: true` and `isArchived: false`.

HAU and AUF close at midnight on the following day. AUF does not inherit HAU's
Facebook link. No phone or Facebook controls appear for AUF or Magalang. The
PHP 135 meal has no inferred serving weights, and the two-flavor 14-piece item
has no assumed split or portion controls. Rice is not included in the 7-piece
or either 14-piece product.

Record flags must be present if data is inserted directly in Atlas. Future
admin forms will apply the model defaults and validation. Do not paste
credentials, guest details, or fictional business claims into these collections.

No new environment variables are required. The existing database user must have
read/write access for seeding posts and saving inquiries.

## Brand, updates, and contact

`CHICKEN_JOO_PUBLIC_CONTENT.md` supplies a brand introduction (not an invented
historical origin story), four restaurant strengths, and three published short
articles dated October 9, October 5, and September 28, 2026. Copy is adapted from
user-supplied captions; it has not been independently verified. The confirmed
menu remains authoritative. No extra products, delivery links, discounts,
vouchers, or redemption terms are inferred.

The `blogPosts` collection stores a slug, title, excerpt, plain-text paragraph
array, article type, draft/published status, calendar publication date, optional
local cover image/Facebook source URL, and menu/branch CTA. Insert-only post
seeding preserves existing edits. Public reads exclude drafts and future dates,
including direct article routes and metadata.

Contact displays current active branch records, including supplied hours and
only supplied phone/social controls. It does not treat a branch number as a
company-wide number. The student-project form stores valid inquiries for later
dashboard review and sends no email. The dashboard is not implemented yet.

Outstanding supplied content:

- A general business email to satisfy the instructor's company contact-information
  requirement. Keep it out of the page until supplied.
- Four strength images, update cover images, and the existing menu photo gaps.
- The three actual Facebook post URLs; source-link buttons remain omitted.
- Actual campaign materials and terms for the separate campaign/voucher work.

No new external configuration is needed for this increment. Hosting-specific
origin/proxy and stronger abuse controls should be configured when deployment
is planned. Admin credentials and session secrets belong to the next increment.
