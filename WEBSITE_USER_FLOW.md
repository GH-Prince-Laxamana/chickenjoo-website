# Chicken Joo visitor flow and page plan

Planning draft, 2026-10-12. Revised around the confirmed campaign-first marketing goal, Landing Page requirements A.1–A.5, Feature Page requirement B, Products or Services Page requirement C, Contact Us Page requirement D, Part II Social Media Marketing Campaign A, and Part III Email Marketing Campaign A / Design Requirements B.1–B.6. Includes the supplied launch dates, all-branch participation, and browser-local voucher simulation. Implementation has begun with About Us; other sections remain the approved plan. Further numbered requirements will be mapped to the relevant page as they arrive.

## Working brand context

Chicken Joo offers Korean-style boneless chicken, solo meals, sharing boxes, and sides at Pampanga branches. The audience hypothesis is students, people choosing a workday lunch, and friends planning a shared meal. Write in friendly, concrete English with occasional familiar Taglish. Keep product names and flavor names consistent with the database.

Likely entry points are social links, shared News articles, searches for the menu, and searches for branch details. These are planning assumptions; traffic and user research have not been supplied.

The confirmed primary purpose is to promote Chicken Joo events, campaigns, and news, then turn that interest into menu exploration and branch visits. The website is a digital marketing destination. Menu and branch information help visitors act on the campaign that attracted them.

The current cart and checkout save pickup selections, but do not arrange fulfillment, take payment, reserve a pickup time, or send confirmation emails. They are generally a supporting path. The proposed 25%-off website-order campaign specifically gives this path a central conversion role, once its discount behavior and redemption terms are implemented. A saved selection should be presented accurately at every step.

The main journey is campaign/event discovery → relevant News story → current meal choices → branch details → directions or direct contact. Returning visitors come back for another relevant update.

The proposed website-order offer adds a campaign-specific journey: Facebook promotion → Home spotlight or campaign article → Menu → Cart → eligible discounted checkout → saved summary and the confirmed branch/redemption next step.

## Visitor journeys

| Visitor intent | Entry | Useful next step | Outcome |
| --- | --- | --- | --- |
| A campaign, event, or shared story catches my attention | Home or News article | Understand the promotion, then current menu or branch details | A reason to try Chicken Joo and a practical route to a branch |
| I need lunch or a box to share | Menu, possibly Home first | Compare portions, price, and available flavors | Choose a meal and find a branch, optionally save selections in the cart |
| I already know Chicken Joo and want to visit | Branches | Choose city, check hours, open directions or contact the branch | A visit or a direct branch inquiry |
| I want to learn more before choosing | About Us or News | Short brand explanation or a relevant article | Return to Menu or Branches when ready |

Home is the campaign showcase and introduction. News articles are campaign destinations that can be shared directly. Visitors can enter any public page and still understand where to go next; a person looking only for menu or directions should retain the direct route.

## Shared components

- **SiteHeader:** keep the brand identity. Proposed navigation order: Home, News, Menu, Branches, About Us, Contact. News remains easy to discover, while a visible Menu shortcut serves visitors ready to choose food. Show the cart count accessibly and keep it easy to reach when selections exist.
- **SiteFooter:** brief brand description, useful navigation, and a route to Contact. Use existing content rather than inventing contact details.
- **MenuItemCard and its options dialog:** one product identity, photo, portion, current price, availability, and one action. The dialog holds description, exact required flavor choices, quantity, subtotal, and add-to-cart feedback.
- **BranchCard:** branch name, city, address, readable hours, directions, and only stored contact methods.
- **News card treatment:** retain the existing image, headline, excerpt, date, and read link. Reuse the visual pattern in small previews rather than creating another article-card design.
- **Contextual next-step block:** use existing links and page content to guide a reader to Menu or Branches. Keep one action visually dominant.

These are component responsibilities, not a requirement to create a separate component file for each section. Reuse the existing components and keep simple sections inline.

## Home: promote what is happening and create appetite

Visitor question: “What is happening at Chicken Joo, and why would I want to join in or try it?”

### Required components A.1–A.5

The numbered items below are requirements, not optional ideas. Their generic integration examples are alternatives; the selected application for Chicken Joo is recorded here.

| Requirement | Selected Chicken Joo application | Required content and behavior |
| --- | --- | --- |
| **A.1 Hero Section** | Brand introduction around the existing swipeable campaign carousel | Chicken Joo name and existing logo, campaign/food artwork, a visible marketing message, and a primary “See what’s new” CTA to News. Keep a secondary “View menu” shortcut. |
| **A.2 About Section** | A short introduction to Chicken Joo and its everyday meal occasions | Explain who Chicken Joo is, Korean-style boneless chicken, solo meals and sharing boxes, and its role in everyday chicken breaks in Pampanga. Link to About Us for more detail. |
| **A.3 Featured Products / Services / Activities** | Selected menu products | Show three database-backed dishes with photo, name, portion/inclusions, current price, and a route to the dish’s options or the full menu. Include a solo meal and a sharing option. |
| **A.4 Promotional Section** | A featured Chicken Joo campaign or event from News | Use the existing News featured-story treatment as a promotional spotlight with artwork, a useful headline, a short reason to care, and a CTA to the full story. Include actual event details or offer terms when supplied. |
| **A.5 Multimedia Integration** | The prepared promotional video, playable directly on Home | An inline video player with user-controlled playback, a short introduction, and a nearby next-step link. An external “Watch video” link alone does not meet this requirement. |

### Proposed page order and visitor flow

1. **Hero: Chicken Joo branding and the preserved FeatureCarousel (A.1).** Add a compact logo/name lockup, a visible message such as “Your next chicken break starts here,” and the persistent discovery/menu actions around the carousel. Preserve swipe, snapping, keyboard controls, and poster presentation. Keep it manually controlled. Each featured campaign or event slide opens its corresponding News story. Curate featured posts around the campaigns the brand wants to promote now. The name, message, and CTA must be understandable without swiping or reading text embedded in a poster.
2. **About: a short brand introduction (A.2).** Explain the food and the occasions it suits in two or three sentences. Suggested direction: “Chicken Joo serves Korean-style boneless chicken in Pampanga. Choose a solo meal for your lunch break or a chicken box to share with the barkada. We bring chicken meals and sharing boxes to your everyday breaks.” Use an “About us” link for visitors who want more context. Keep any formal mission or founding-history claims dependent on supplied brand information.
3. **Promotional video: see the brand and food in action (A.5).** Place the prepared video after the short introduction so visitors understand the brand before watching. Give it a concise heading and a caption aligned with its actual contents. For a general brand video, use a “View menu” next step; for a campaign-specific video, link to its matching News story. Visitors can continue down the page without playing it.
4. **Campaign spotlight and News preview (A.4).** Reuse the successful News layout: one prominent promotional story followed by up to two supporting published stories. The spotlight expands on a campaign instead of repeating the carousel poster alone. Surface events when real details are supplied; otherwise use existing campaigns and brand news. Keep the destination clear with “See campaign details,” “Read the story,” or an event-specific label supported by the content. This section gives visitors a current reason to engage with Chicken Joo.
5. **Menu picks: choose something to try (A.3).** Use three curated, database-backed dishes showing a solo meal, a sharing box, and another useful choice. Show current prices and portion details. Label the selection “Menu picks,” unless bestseller evidence is supplied. Reuse MenuItemCard and offer “View full menu.” Inspired visitors can now move from a campaign to a specific meal.
6. **Branch invitation: make the visit practical.** Use existing Pampanga branch data and finish with “Find a branch,” then directions or direct contact. This supports the marketing goal beyond the five required components.

The Home journey is **campaign attention → brand understanding → optional video engagement → campaign details → meal choice → branch visit intent**. The video supports the existing landing page rather than replacing its carousel or requiring an entirely new design. Persistent Menu and Branches navigation still serves visitors ready to act immediately.

### Video integration requirements for implementation

- Supplied video: `https://www.facebook.com/reel/1619386856563849/`. Home uses Facebook's inline video iframe with lazy loading, a reserved portrait player area, fullscreen support, and autoplay disabled. A Facebook source link is available if playback is blocked. The video itself could not be inspected through the available read-only web access; confirm playback, public visibility, content, and spoken-content captions during the user's browser/content review.
- Use the prepared video; its file or embed URL will determine the final player source. Prefer a native inline player when a repository-hosted video file is supplied. If the prepared source is YouTube or another supported embed provider, use an inline embed on Home.
- Keep playback user initiated with visible controls. Provide an appropriate poster image and reserve the player’s display area so loading does not move the surrounding content.
- Support mobile viewing within the page and fullscreen playback. Avoid downloading the full video before the visitor chooses to play it where the hosting method permits.
- Include captions for spoken content and a short descriptive caption or transcript when needed to convey important information accessibly. The actual video must be reviewed before writing its descriptive text.
- If the player cannot load, show a useful fallback message. A source link can be offered as a recovery action, but successful normal operation must allow direct viewing on the landing page.
- The video is one prepared marketing asset for now. Choose its source at implementation time without adding a video database collection, upload workflow, or new content-management feature solely for this requirement.

### Landing Page acceptance checklist

- A.1: Chicken Joo name, logo, main visual, marketing message, and CTA are present; the swipeable component and its controls remain intact.
- A.2: The About section clearly states identity, offering, and brand purpose/story in concise copy.
- A.3: Selected menu products render from the existing catalog with current prices and valid actions.
- A.4: At least one explicit promotional spotlight is present and opens relevant, published content.
- A.5: The prepared promotional video can be played directly within Home on mobile and desktop.
- The page communicates its identity without requiring carousel interaction or video playback, and provides a continuous route to News, Menu, and Branches.

Implementation checkpoint, 2026-10-12: Home now has visible Chicken Joo identity and a campaign-first News CTA above the preserved swipeable carousel. A brief About introduction leads into the supplied Facebook Reel, followed by a database-backed promotion spotlight using the existing News composition, existing menu cards, and a branch invitation. The spotlight prefers the launch campaign during its valid dates and uses another featured promotion afterward. Featured posts, publication visibility, product prices, availability, and product options still come from the existing data paths. Carousel poster styling, swipe behavior, controls, and keyboard handling remain unchanged; its redundant hidden H1 was removed in favor of the visible Home H1. Email design is untouched. Facebook playback and video captions await user review; broader audits remain deferred.

## Menu: turn appetite into a choice

Visitor question: “What suits my appetite and budget?”

### Products or Services Page requirement C

**Selected page:** the existing `/menu` page. Chicken Joo offers food products, so the product-catalog application is appropriate. Reuse CatalogBrowser, CatalogControls, MenuItemCard, and the meal-options dialog. A separate Products page would duplicate the menu.

Menu now provides the requested information across its cards, category sections, and dialog. Product descriptions and standalone prices are visible on the cards before opening their options. Flavor-count guidance is separate, with availability and an action that accurately opens the product's options or details.

| Required information | Current implementation | Planned improvement / acceptance |
| --- | --- | --- |
| Image | MenuItemCard uses a stored local image or the existing supplied artwork mapping; missing/failed images have a fallback. | Keep the real photo for each supplied dish, its alternative text, and a clear fallback. Do not substitute another product’s image. |
| Product name | The database name appears on the card and in its dialog. | Keep one consistent identity throughout Menu, Cart, and the saved order. |
| Description | The database description appears on every card and in its dialog, with separate flavor guidance. | Keep portion and inclusions visible; retain the full description in the dialog. |
| Category | Products are grouped beneath headings derived from their stored category, with category filters. | Retain clear category sections; the grouping identifies each product’s category without repeating a badge on every card. Show its category in the dialog as context. Preserve admin-defined categories beyond the supplied ones. |
| Price | Current PHP price is separate from the card CTA and remains in the dialog; quantity changes update the dialog total. | Retain accurate PHP formatting and quantity totals using `priceCentavos`. |
| Availability | Unavailable products show “Currently unavailable,” remain viewable, and cannot be added. Archived products are excluded by the public API. | Show concise availability based on `isAvailable`, retain details access for unavailable dishes, and disable adding them. Do not imply live stock counts or availability at every branch. |
| Call-to-action | “Add to Cart” opens the flavor and quantity dialog for available products; “View details” opens unavailable products. The dialog action saves the configured selection. | Keep the calculated total in the dialog add action, and preserve details access for unavailable dishes. |

### Product card and detail responsibilities

The card should let a visitor answer “What is it, what comes with it, what does it cost, and can I select it?” A chicken-and-rice meal, for example, should show the supplied piece count and rice inclusion before the visitor opens its flavor choices. Sharing-box descriptions should clearly indicate that sides are separate. Use the existing product descriptions rather than inferring weights, servings per person, or ingredients from photographs.

The dialog should help them configure the choice: full description, category, current unit price, photo previews that update with radio-selected flavors, quantity controls, calculated total, availability, and add-to-cart feedback. Missing and duplicate choices receive specific inline errors. Sides with no flavor requirement retain their simpler quantity selection. Two-flavor products require two distinct flavors; selections come from that product’s `flavorOptions`.

The separate flavor gallery was removed so visitors choose flavors in the product dialog itself. The eight supplied chicken flavors share the same ordered artwork mapping used by seeded chicken products and the existing catalog records. A promoted flavor in News does not automatically become a menu option.

These changes use fields already returned by the public catalog API: `name`, `description`, `category`, `priceCentavos`, `image`, `isAvailable`, `flavorOptions`, and `requiredFlavorCount`. Keep repository-stored artwork. There is no need for new product-detail routes, schema fields, an image-upload service, stock counters, or an additional ordering system to satisfy C.

### Page order and marketing role

Page order:

1. A short introduction and category controls for the existing meal, chicken, and side categories.
2. The existing search control, with less visual emphasis than browsing the small catalog.
3. Clear category sections using MenuItemCard. Every card shows a relevant photo, name, useful description, standalone current price, availability, and a clearly labeled options/details action as specified in C.
4. The existing options dialog for flavors and quantity. Keep detailed controls inside the dialog rather than expanding every card.
5. An easy “View cart” route when selections exist, plus a “Find a branch” route for visitors planning a visit.

Show what is included with a meal and what must be added separately. Preserve filters, loading, empty, retry, and unavailable states.

Within the marketing flow, Menu turns campaign interest into a concrete choice. Visitors coming from News can compare current products without treating campaign artwork as a current price list. Visitors arriving directly can browse immediately. Keep “Find a branch” easy to reach for those planning a visit; the cart is an optional way to keep selections together.

### Products Page acceptance checklist

- Each supplied dish has a relevant product image, name, meaningful description, identifiable category, current PHP price, availability, and a working CTA.
- Visitors can compare portion/inclusions and price from the catalog without opening every dialog.
- Options/details actions open the correct product; flavor choices and quantity totals reflect its current data.
- Unavailable products remain understandable and viewable but cannot be added; archived products remain hidden.
- Filtering, pagination, loading, empty results, retry, and image fallback remain functional.
- Menu leads naturally to a branch visit or optional cart review, with the existing checkout price/availability checks preserved.

Implementation checkpoint, 2026-10-12: Menu has a clearer introduction, full product descriptions, separate prices, explicit availability, and options/details CTAs. The dialog now shows its category while retaining flavor validation, quantity selection, totals, and cart actions. A branch invitation connects meal discovery to a visit. MenuItemCard is shared with the Home menu preview, so these product-information improvements also reach that preview. No database fields or ordering logic changed. Browser review and broader checks are deferred to the user/final audit as requested.

Revision, 2026-10-13: Menu and Home use the same left-aligned meal card with price beside an Add to Cart action. The standalone flavor gallery has been removed; each chicken product dialog uses radio choices, changing flavor photos, a quantity stepper, and inline selection errors. The five seeded chicken products now offer all eight mapped flavors in the catalog, including on existing records. Cart and pickup retain the selected flavor names.

## Branches: make the visit practical

Visitor question: “Which location works for me?”

Page order: brief introduction, city filters, branch search, then BranchCards.

Give each branch a clear directions action. Keep the address and hours scannable; contact links are secondary. A visitor who already knows their location should not have to read brand storytelling first.

Use the existing cities and branch records. Do not add automatic nearest-branch ranking, “open now,” verified place pins, or delivery-coverage claims without the supporting behavior and data.

Implementation checkpoint, 2026-10-12: Branches now uses the same header hierarchy as About Us and Menu. Branch cards emphasize location, readable opening hours, and a prominent Google Maps action; supplied branch phone/email/Facebook links remain optional secondary contacts. City filters, search, pagination, and API loading/error states are retained. A Menu invitation supports planning a meal before visiting, and a general-contact link points to the company inquiry page. No fabricated branch photos, geolocation, or live opening status were added. Browser review and broader checks remain deferred as requested.

## News listing: preserve the editorial layout

Visitor question: “What’s happening at Chicken Joo, and which story is relevant to me?”

Keep the current featured-story layout, category pills, article grid, and pagination. Maintain its hierarchy and generous artwork presentation.

The featured story attracts attention; excerpts explain what readers will get. Each card opens its article. Actual events can appear in this feed without creating a new page or a new registration system. The final menu invitation connects reading to choosing food. Publication dates and category labels remain visible, and campaign artwork is not presented as a current offer automatically.

News supports the Feature Page requirement through illustrated flavor and meal stories, but it is primarily a changing campaign feed. Its large spotlight only appears when the first page of results contains a featured promotion with artwork; article filters, later pages, or editorial changes can remove it. Keep this successful layout and its campaign-discovery purpose. The permanent brand-strength presentation described under requirement B belongs on About Us.

Implementation checkpoint, 2026-10-12: The launch campaign is published and featured in MongoDB using `src/data/launch-campaign.json`. News prioritizes it while active, and the existing Home carousel receives it through featured posts. Cart shows estimated savings; the server quote applies 25% off the total with no minimum spend during the Philippine-time date range. Checkout, receipts, and admin review show the saved promotion breakdown. Browser-local redemption is recorded after successful saving and reconciled on receipt recovery. One focused financial/date test was added; broad audits and browser checks remain deferred.

## News article: connect the story to a useful action

Keep the artwork-and-text layout, readable body, date, source link when supplied, and back-to-News navigation.

Use a next step that fits the story:

- Meal, flavor, or sharing story: “See the current menu.”
- Branch or delivery story: “Find a branch.”
- Event story: “Find the participating branch,” with the actual event date, location, and participation details clearly stated in the article.
- Community story: a gentle invitation to explore the menu or continue reading.

The existing post CTA destination supports Menu and Branches already. Do not imply that an illustrated campaign flavor is currently selectable. Keep availability guidance next to the relevant campaign content.

## Campaign content and publishing rules

Every promoted story should give visitors a reason to care, the useful facts, and one clear next action. Flavor stories help them choose food; branch events help them plan a visit; community stories build familiarity and encourage another meal.

Use the existing posts collection, article/promotion types, published status, featured flag, artwork, body paragraphs, and Menu/Branches CTA fields. Event details can be clearly written in article text for now. There is no structured event date, event venue, registration, or campaign-expiry field, so do not invent automatic event filtering, booking, or countdown behavior.

For an actual event or offer, obtain its name, event date/time, participating location, purpose, applicable terms, and intended next action. Distinguish the event date from the post’s publication date. Only publish urgency, discounts, or participation claims that the supplied details support.

After an event or campaign ends, remove it from the featured carousel and label the article accurately as past coverage where needed. Published history can remain readable. This requires editorial upkeep with the current model; automatic expiration would be a separate future feature.

## Part II: Social Media Marketing Campaign A

**Requirement:** identify one campaign that demonstrates how Chicken Joo promotes its products or campaign through social media. This is a marketing initiative spanning existing pages and social content; it does not require a separate top-level campaign page.

**Selected campaign:** “Chicken Joo Website Launch: 25% Off Website Orders.” The user has supplied the offer concept and has prepared square artwork. The supplied square campaign asset is `public/images/news-launch-campaign.png` (public URL `/images/news-launch-campaign.png`). This is the single campaign to use for this requirement and for the email mockup; other News stories remain supporting editorial content.

**Confirmed terms:** website-launch promotion, September 15 through October 15, all branches participating, one redemption. The year is confirmed as 2026. Plan inclusive calendar dates in Philippine time (UTC+8), ending after October 15. Use the confirmed 2026 date range; the implementation will use inclusive Philippine-time calendar days.

**Chosen redemption simulation:** one redemption per browser profile on the deployed website origin, tracked with localStorage. This represents the user’s requested simulation without customer accounts; it is not verified one-per-person enforcement.

### Campaign purpose and message

- **Audience:** people attracted by Chicken Joo’s social content who are considering a solo meal or sharing box.
- **Offer:** 25% off eligible orders made through the website for the website launch, September 15–October 15, with all branches participating. The user confirmed 25% off the total order with no minimum spend. Do not introduce a discount cap or extra restrictions from the older email mockup.
- **Marketing objective:** turn social attention into website visits, meal selection, and use of the website ordering flow, with a clear next step at the branch.
- **Core message direction:** “Get 25% off your website order.” Use only once the offer’s terms and actual discount behavior support that statement.
- **Primary website CTA:** “Choose your meal,” leading to Menu. Keep the amount, important eligibility conditions, and a “See offer details” link close to the promotion.

### Where the campaign appears

| Placement | Component / role | Visitor action |
| --- | --- | --- |
| Facebook campaign post | The prepared square artwork, a concise caption, offer conditions, and a link to the campaign story on the website. | Visit the website to understand and use the offer. |
| Home swipeable hero | One campaign slide in the preserved FeatureCarousel. Keep the square artwork readable and proportionate rather than cropping out offer text. | Open the matching campaign story. |
| Home promotional spotlight | The same campaign expressed with an offer headline, a short explanation, key terms, and a visible CTA using the News spotlight treatment. | Read offer details or go to Menu. |
| News featured promotion | A published promotion post with the square artwork and an excerpt identifying the website-only offer. The spotlight label must suit an offer; its current flavor-specific wording should be made context-appropriate during implementation. | Read the campaign article. |
| Campaign News article | The canonical explanation of eligibility, dates, redemption, and how to participate. Use the existing `/news/[slug]` layout and its Menu CTA. | Choose a meal and follow the eligible website-order flow. |
| Menu / Cart | A compact campaign reminder and link to the same terms, without obscuring normal product comparison or cart editing. | Review selections and continue to checkout. |
| Checkout / receipt / admin order review | Show the actual eligible discount and resulting total consistently once implemented. | Understand the savings and the saved order’s next step. |

Reuse the same artwork and canonical terms across placements. Home creates attention, the article explains the offer, and checkout demonstrates it accurately. Ordinary menu prices remain the base prices; a website-order promotion should not overwrite catalog prices.

### Facebook integration

A labeled link to the relevant supplied Chicken Joo Facebook page supports the campaign by connecting the website to its social presence. Pair it with a prepared social post using the artwork, a caption, and a website destination to demonstrate the actual promotion plan; the page link alone does not show how the offer is promoted.

Use the exact company or participating branch Facebook URL supplied for this campaign. Existing branch Facebook links are available, but do not assume an unrelated branch page is the campaign’s company-wide account. Label a page link “Visit Chicken Joo on Facebook.” Use a post’s `sourceUrl` and “View original Facebook post” only if the actual campaign post URL is supplied. Creating a caption or website component does not authorize posting to Facebook.

### Ordering alignment: required before activating the offer

The quote service now calculates and snapshots the launch discount when requested by an eligible browser during the campaign dates. A promotion post with `type: promotion` does not create a discount. Advertising 25% off while saving the full-price total would conflict with the campaign promise.

The future implementation must:

- Apply confirmed eligibility rules and calculate the discount on the server using integer centavos. Decide the eligible amount, rounding, and any cap explicitly when terms are confirmed; client-submitted discount amounts must not be trusted.
- Include base subtotal, discount amount, final total, and campaign identity in the reviewed quote and saved order snapshot. Reflect them consistently in customer and admin summaries, while keeping previously saved orders accurate.
- Recheck campaign validity on submission and include the pricing result in the existing quote hash. If eligibility or the total changes, require an updated review using the existing changed-quote behavior.
- Preserve current availability checks, required flavor choices, quantity limits, retry safety, private receipts, and order history.
- Explain how a saved website order qualifies for the branch discount. The current system does not automatically arrange restaurant fulfillment; confirm the business’s acceptance/redemption process before claiming that a saved record secures a real-world discount.

For this single campaign, automatic application to eligible website orders is the recommended simplest mechanism, subject to confirmed terms. A coupon field or general promotion-management system is unnecessary unless the actual campaign requires one.

### One-redemption voucher simulation and deployment

Use a campaign-specific localStorage redemption marker, separate from the existing cart storage key. Keep this marker free of guest name/email and other customer details. The voucher presentation has clear available, applied, and redeemed states. Applying it to a quote does not consume it; mark it redeemed only after the discounted order is successfully saved. A failed submission should remain retryable. Recovering a previously saved discounted receipt should also reconcile the browser marker after a lost submission response.

The client uses the marker to suppress repeat redemption in the same browser profile. The server still determines active dates, product/branch eligibility, and the actual discount amount; the client does not supply trusted pricing. Retain the existing duplicate-submission handling so retries of the same saved order do not create another redemption.

localStorage works on a deployed website and normally persists across browser sessions for that origin. Production and preview domains, localhost, different browsers/profiles/devices, and HTTP versus HTTPS do not share one redemption marker. Clearing site storage or using private browsing can reset it, and browser-local checks alone cannot atomically prevent two simultaneous new redemptions. Handle unavailable storage explicitly instead of silently treating every attempt as a first redemption. These are accepted simulation limits; real one-per-person enforcement would need a server-side identity and redemption record later. See [MDN Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) and [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

In implementation, explain the accepted limit in a `shortcut:` code comment. Offer wording must not claim verified one-per-customer enforcement when the actual mechanism is browser-local.

### Details to confirm before implementation/publication

1. Confirmed: September 15–October 15, 2026; plan inclusive Philippine-time validity.
2. Confirmed: 25% off the total website order, no minimum spend, all branches, and one browser-local redemption. No additional cap or combination terms have been supplied.
3. Confirm automatic application/claim behavior unless a code is specifically required; none has been supplied.
4. How the branch accepts/redeems website orders and when an order qualifies for the offer.
5. Confirmed artwork: `public/images/news-launch-campaign.png`. Use the supplied company Facebook page; an original campaign-post URL is optional and has not been supplied.

Record these as content and functionality dependencies, not invented offer conditions.

### Social campaign acceptance checklist

- One clearly named campaign, objective, audience, offer, and participation path are documented.
- Prepared square artwork and a social caption/link plan demonstrate how Facebook promotes the campaign.
- Home and News surface the same offer through the existing carousel and spotlight layouts.
- The campaign story is the single reference for confirmed terms; publication date and offer validity are distinct.
- Website actions lead to current meal choices and the applicable ordering/redemption process.
- Checkout, saved receipt, and admin totals actually reflect the server-calculated offer before it is presented as active.
- One-redemption simulation persists on the deployed origin, is consumed only after successful saving, and keeps failed attempts/retries usable. Its browser-local limit is documented.
- Facebook destinations are real supplied links; page links and original-post links are labeled correctly.
- If measurement is added, distinguish social referrals, campaign-to-Menu clicks, and eligible saved orders. Saved orders are not proof of completed purchases or branch visits.

## Part III: Email Marketing Campaign A and Design Requirements B.1–B.6

**Requirement scope:** visualize the email that would be sent. Actual email delivery is not required. Use the same Website Launch / 25%-off campaign so social, website, and email promotion tell one consistent story.

**Selected implementation location:** an authenticated admin-side “Email campaign” preview, using the existing `public/email.html` as the starting design. The existing file is served as a static artifact and now has an authenticated admin preview at `/admin/email-campaign`, reachable through admin navigation. The preview does not send email.

### Assessment of the existing email.html

The existing mockup has a Chicken Joo logo, a promotional banner, body copy, and a CTA. Its content represents an older offer: “one week,” “Angeles City branch,” no minimum spend, no promo code, and a non-combination restriction. Those statements are not all supported by the newly supplied terms. Align its preheader, branch badge, message, fine print, and footer with the launch campaign before using it as the final visualization.

The subject currently exists in an HTML comment and document title, not as a visible inbox-style subject line. The preview must make the subject visible. The footer has no usable website/email/phone/social contact block; the address in the HTML comment is a sample, not evidence of a monitored company mailbox. The generic subscription claim and named recipient are sample content, not an implemented subscriber list or actual recipient selection.

The paragraphs above record the original assessment. Implementation checkpoint, 2026-10-12: after restoring the user-supplied original `email.html`, an explicitly authorized text-only pass aligned its subject, preheader, headline, greeting, body, CTA, terms, and footer with the approved launch campaign. All original CSS, existing inline styles, image markup, table layout, colors, typography, banner, and button treatment are preserved. New text links use the existing text palette. The email now states September 15–October 15, 2026, all-branch participation, 25% off the total website order with no minimum spend, and one redemption per browser after saving an eligible order. The CTA leads to Menu; offer details and supplied company contacts are linked. The unsupported subscription claim and named sample recipient were removed. Admin subject/preheader and preview remain aligned. Browser review and broad checks remain deferred.

### Requirement mapping

| Requirement | Selected email mockup component | Planned content / behavior |
| --- | --- | --- |
| **B.1 Company Logo** | Existing logo header | Reuse the Chicken Joo logo with useful alternative text. |
| **B.2 Subject Line** | Visible subject row above the email preview | Suggested subject: “Chicken Joo is online: get 25% off your website order.” Add a short preheader describing the date range and all-branch participation. |
| **B.3 Header Image / Promotional Banner** | Existing hero-banner area | Use the prepared campaign artwork or retain the existing banner only after its embedded wording is checked against the confirmed offer. Preserve the asset’s proportions and ensure offer text is readable. |
| **B.4 Main Marketing Message** | Short launch announcement and offer copy | State that the website has launched, explain the 25% website-order offer, show September 15–October 15 and all-branch participation, then tell the reader how to take the next step. Avoid unsupported conditions from the old draft. |
| **B.5 CTA Button** | One prominent existing-style button | “Choose your meal” leads to Menu on the confirmed deployed website. Include a quieter “See offer details” link to the canonical campaign article. Use fully qualified website links in the email artifact. |
| **B.6 Company Information** | Complete footer contact block | Show the confirmed website, company email `jooservice@chickenjoo.com`, company phone `0976 200 2000`, and the supplied company Facebook link. Use the supplied Taguig company address in the email footer. Use the supplied company email `jooservice@chickenjoo.com`; replace the old sample `hello@chickenjoo.com`. |

### Message direction

Proposed launch copy, subject to confirming the remaining terms:

“Chicken Joo’s website is here. Browse your chicken meals, choose your flavors, and get 25% off an eligible website order from September 15 to October 15. All branches are participating. Pick your next chicken meal and see the offer details before checking out.”

Place the one-redemption wording and other confirmed terms beside the CTA or in readable fine print. Describe the browser-local mechanism accurately in the project demonstration; do not introduce a claim of verified customer identity. The final message and CTA must match the website’s implemented redemption steps.

### Admin preview and asset handling

- Reuse the existing email design and asset rather than building an email editor or template-management system.
- Provide a visible campaign name, subject, preheader, validity summary, and the rendered email. Support a desktop preview and a narrow/mobile preview so the visualization demonstrates readability at both sizes.
- If the HTML is embedded in an admin iframe, give the frame a descriptive title and keep relative image paths working. Serve or resolve its existing `./images/` references correctly; do not accidentally resolve them under `/admin/`.
- A public static mockup is not a private inbox. Keep actual customer/recipient data out of `public/email.html`; show a generic greeting or clearly fictional preview recipient.
- Use actual supplied website/contact/social destinations. The draft contains a Vercel URL, which remains a proposed destination until confirmed as the intended deployment. Actual email sending would additionally require hosted absolute asset URLs and email-client testing, but neither is needed to fulfill this visualization requirement now.
- Label admin preview actions as preview/open actions. The requirement does not justify sending email, adding a mail provider, building subscriptions, storing recipient lists, or scheduling campaigns.

### Email campaign acceptance checklist

- Part III A: the email clearly promotes the same Chicken Joo Website Launch / 25%-off campaign used on Home, News, and Facebook.
- B.1–B.6: logo, visible subject, banner, concise main message, working CTA, and supplied company/contact/social information are all present in the visualization.
- Dates, all-branch participation, and one-redemption wording agree across email and website; unsupported older terms are removed.
- An authenticated admin user can reach and view the existing-artifact-based preview, including a mobile-sized presentation.
- Images and navigation links work in the admin preview; the HTML contains no real recipient data.
- The mockup demonstrates intended marketing delivery without requiring or triggering actual email sending.

## Feature Page requirement B: describe and show a brand strength

**Required minimum:** at least one clearly identifiable feature or strength, with both a description and a meaningful visual. Icons, photos, infographics, animation, cards, and interactive components are alternative ways to present it; the requirement does not call for using all of them.

**Selected page:** the existing About Us page. It already describes Chicken Joo’s strengths and suits a permanent explanation of why someone would choose the food. Use the established News image-and-text treatment for a prominent feature section. A new `/features` route is unnecessary for the current wording. Revisit this mapping if subsequent requirements explicitly require distinct pages for Features and About.

### Feature 1: a good break, close by

| Element | Planned Chicken Joo implementation |
| --- | --- |
| Strength | Convenient branches that fit a break from work or campus routines, based on the user's supplied positioning. |
| Visitor benefit | Make time for a chicken meal with coworkers and find a branch that works for the day. |
| Description direction | Explain how Chicken Joo fits lunch or an after-work catch-up, then guide visitors to actual branch locations. |
| Visual | User-supplied photo `/images/lifestyle/about-friends-chicken-joo.png` shows a group sharing chicken and rice. It visualizes the shared-meal occasion without claiming a specific branch or customer identity. |
| Presentation | A prominent image-and-description section inspired by the News spotlight, side-by-side on desktop and stacked on mobile, with a “Find your Chicken Joo” CTA to Branches. |
| Data alignment | Branches provides current stored locations, hours, and directions. Avoid literal nationwide “anywhere” coverage or guaranteed proximity to every workplace. |

Use the existing artwork mapping rather than duplicating the image path in multiple places during implementation. Preserve the current product-selection dialog for interactive flavor choice on Menu. No new flavor-selection widget or animation is needed to satisfy B.

The user's other supplied strengths are generous, quality servings at affordable prices, and in-person ordering, pickup, or online ordering through GrabFood/foodpanda. Present them explicitly as supporting reasons to choose Chicken Joo. The benefit cards introduce these strengths, the sharing-box photo supports portion/value messaging, and labeled ordering-method icons explain the available paths. Phrase value as “affordable” rather than an unverified cheapest-in-market ranking.

### Feature Page acceptance checklist

- About Us visibly highlights at least one concrete Chicken Joo strength.
- Feature 1 has a heading, a benefit-led description, and an actual relevant image with useful alternative text.
- Visitors can understand the strength on the page without opening a News article or operating an interactive control.
- Its CTA takes the visitor to branch information, while the portion/value section links to current menu choices.
- The feature remains present when News filters, pagination, or featured-post selections change.
- The existing News layout and landing-page swipeable component remain preserved.

## About Us: help a new visitor understand the brand and its strengths

Visitor question: “Is this food for the kind of meal I have in mind?”

Page order: concise brand introduction, Feature 1 convenience/workday-break illustration and description, three reasons to choose Chicken Joo, the portion/value section with its sharing-box photo, three clear ordering methods, then a branch invitation. The page is named About Us at `/about-us`; legacy `/our-story` links redirect there, and shared navigation uses About Us.

Use the image-led composition and spacing that work in News. Draft everyday scenarios and purposeful illustrations to complete the experience. The user has deferred content verification to the end of the increments; record supplied positioning and generated imagery for that final pass. Do not invent historical facts, awards, customer testimonials, or actual branch photographs.

Implementation checkpoint, 2026-10-12: About Us has been built around the three supplied strengths with one generated contextual illustration, one existing product photograph, Menu/Branches actions, updated shared navigation, and a legacy-route redirect. Homepage carousel and News layout are unchanged. Final business-claim verification remains deferred as requested.

Revision, 2026-10-13: The user removed the product showcase from About Us and restored the separate portion/value section. The page now moves from its image-led introduction to the three benefit cards, the sharing-box value section, ordering methods, and branch CTA. The menu catalog and its product images remain available on Menu.

Image revision, 2026-10-13: About Us now uses the supplied group photo. Home's hero keeps only the chicken product image; the other hero slideshow images and the old illustration used as the video fallback were removed.

## Contact: general company inquiries

Visitor question: “How do I get in touch with Chicken Joo?”

### Contact Us Page requirement D

**Selected page:** `/contact`, focused on general company inquiries. The user explicitly requested that branch-specific contacts and the branch directory be removed from this page. Keep branch information on Branches. Reuse InquiryForm and the existing protected admin inbox.

| Required form item | Handling |
| --- | --- |
| Customer name | Existing required Name field with validation and autofill. |
| Email address | Existing required Email address field, saved with the inquiry. |
| Subject | Existing required Subject field for the inquiry context. |
| Message | Existing required Message textarea; preserve input after a failed submission. |
| Date, if applicable | Record the submission timestamp automatically on the server and display it in admin review. |
| Submit button | Keep “Send message” and accurate pending, error, and saved-message feedback. |

### Confirmed company contact information

- Email: `jooservice@chickenjoo.com`, displayed with a mailto link.
- Phone: `0976 200 2000`, displayed with a `tel:+639762002000` link.
- Facebook: `https://www.facebook.com/profile.php?id=61574092604052`, displayed as a company-level Facebook link. The comma at the end of the supplied URL was punctuation and is excluded.
- Inquiry reviewer: the admin using the existing private dashboard. No separate reviewer role or forwarding system is required.
- Company address: Lot 5 Blk 7 Japan Street Phase 2 Barangay Pinagsama Taguig City, 1636.
- General inquiry/support hours: 9 AM–9 PM. Operating days were not supplied; do not add a “daily” claim.

These are user-supplied details; final content verification remains deferred to the end of the increments.

### Page order and communication flow

1. Short general-inquiry introduction.
2. Company email, phone, and Facebook panel beside the four-field form on desktop, stacked on mobile.
3. Brief explanation of general questions and feedback; form messages are saved privately for admin review.
4. Accurate submission feedback, retaining the existing validation, retry safety, submission protections, private storage, and admin review/resolution.

The communication path is **visitor inquiry → private admin inbox → admin review/resolution**. The form does not send an email automatically. The clickable email link separately opens the visitor’s email application.

### Contact Us acceptance checklist

- Name, email address, subject, message, and a working submit action are present and validated.
- Submission dates are recorded automatically and available in admin review.
- Company-level email, phone, and Facebook destinations match the supplied information.
- Contact contains no branch directory or branch-specific contact information.
- Company address and 9 AM–9 PM support hours are displayed alongside the supplied email, phone, and Facebook link.
- A valid submission reaches the private inquiry inbox and shows an accurate confirmation; failures preserve input.

Implementation checkpoint, 2026-10-12: Contact was revised to the confirmed general-inquiry scope. The branch query/directory was removed, company email/phone/Facebook links were added, and the existing form/admin flow was retained. Browser review belongs to the user; broader audits remain deferred.

## Cart: reassure the visitor about their selections

Show selected dishes, flavors, quantities, individual prices, and estimated subtotal. Make quantity adjustment and removal clear. Explain that checkout checks current prices and availability.

Use one primary “Review pickup details” action and a quieter “Continue browsing” link. Keep promotional stories out of the transaction area so the visitor can concentrate on reviewing their meal.

## Checkout and receipt: set accurate expectations

Checkout should show pickup branch, name, email, current order review, and the final save action in a clear sequence. Retain guest checkout and the existing server checks. Explain price changes beside the review and retain selections when submission fails.

The receipt shows saved reference, branch, items, total, status, and how to return to the receipt within the existing browser-tab access period. Explain the actual pickup next step. A saved record must not be labeled as accepted by a restaurant or as a reserved pickup time.

## Visual direction

Keep the existing navy, red, pale blue, yellow, and Inter typography. Preserve the carousel and News compositions as the visual anchors.

Use food photography and large images for discovery; use clear rows, restrained containers, and concise labels for choosing and reviewing. Share spacing, button treatment, and type hierarchy across pages while allowing each page to suit its job. Do not put every kind of information into the same card grid.

## Implementation order and evaluation

1. Landing Page requirements A.1–A.5: preserve the carousel, add its clear brand/CTA framing, a brief About section, the inline prepared video, a campaign spotlight, and selected menu products in the documented order.
2. News article next steps: retain the successful layout and connect stories to Menu or Branches according to their subject.
3. Products Page requirement C on Menu: show complete, scannable product information on cards and retain the existing flavor/quantity dialog with accurate actions.
4. Branches: strengthen the route from campaign interest to a visit or direct contact.
5. Feature Page requirement B on About Us: present Feature 1 with its contextual workday-break illustration and description using the News visual language. Refine Contact for requirement D as a general-inquiry page with company contact details and the existing admin inbox.
6. Part II Social Media Marketing Campaign A: integrate the prepared 25%-off artwork into Home/News and prepare the Facebook post/link plan. Before activating the offer, align Cart, checkout, receipts, and admin summaries with the confirmed server-calculated discount and redemption terms.
7. Part III Email Marketing Campaign A / B.1–B.6: align the existing email.html with the same launch campaign and expose its rendered mockup through admin navigation, with visible subject and complete supplied company information.

Validate the plan with the Landing Page A.1–A.5, Feature Page B, Products Page C, and Contact Us D checklists and task checks: understand Chicken Joo’s identity without swiping; understand what a carousel campaign promotes; play the promotional video directly on Home; describe the strength illustrated by Feature 1; distinguish an event date from publication date; identify the next step from its article; compare meal inclusions and prices directly on Menu; choose a two-flavor box; recognize an unavailable product; find branch hours and directions; send an inquiry and locate it in admin review; explain what checkout actually saves.

If analytics are later added, measure campaign slide-to-article clicks, article-to-Menu or article-to-Branches clicks, and branch directions/contact clicks. Video plays are an additional engagement signal; the stronger outcome is continuing from video/campaign interest to a meal or branch. Track which story visitors followed so the website can demonstrate how a campaign led to interest and intended visits. Directions clicks indicate visit intent, not confirmed foot traffic. Treat time on page as a supporting signal, not the main marketing result. No conversion lift is assumed.

## Research used

Final audit checkpoint, 2026-10-12: see `WEBSITE_AUDIT.md` for source/data alignment, read-only database results, two confirmed fixes, targeted validation, and remaining owner-review items. UI compositions and the restored email design remain preserved; no database records were changed during the audit.

Clear labels and accurate previews help visitors predict where a link leads: [Nielsen Norman Group, Information Scent](https://www.nngroup.com/articles/information-scent/).

Visible totals and an unambiguous review/final-action distinction inform the transaction guidance: [Baymard Institute, Checkout UX Guide](https://baymard.com/blog/checkout-flow-ux-optimization). Apply those principles to the website’s actual saved-selection flow rather than importing payment features it does not have.

## Account and voucher update — October 14, 2026

This update supersedes the earlier browser-only voucher simulation. Public browsing remains open. Adding a meal requires a customer account; registration/login restores the pending meal selection. Carts are scoped per account in browser storage. Orders and private receipts require the owning account, and name/email come from the server session.

Vouchers now permit one redemption per customer account. MongoDB enforces this atomically when the order is inserted, including simultaneous submissions from multiple tabs or devices. Cancellation does not reset redemption. Existing anonymous orders remain labeled Guest in admin and are not linked using unverified email addresses.

Admin registration is removed. The existing local setup command provisions administrators. Customer forms are white; only the admin sign-in card is navy, on a white page. The new admin Customers dashboard provides searchable accounts, customer profiles, voucher status, and order history. A link icon beside the customer in Orders opens that exact customer profile.

Sessions are hashed server-side, expire after eight hours, use HttpOnly/SameSite cookies, rotate at login, and revoke at logout. Production cookies are Secure. Same-origin checks, persistent authentication throttling, active-account checks, and explicit private-data projections protect the APIs. See README for APP_ORIGIN and trusted-IP-header deployment configuration. Email verification, password recovery, and MFA are outside this implementation.
