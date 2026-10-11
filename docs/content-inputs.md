# Verified menu and branch inputs

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
read access to the configured database; later admin writes will need write access.
