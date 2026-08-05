# RBS website content-model specification

**Status:** review-only recommendation. No application, CMS, Shopify, Cloudflare, analytics, secret, deployment, or existing-content change is authorized by this document.

## Model intent

RBS should become a commentary-first destination for credible security thinking, practical improvement, and sharp humor about security, AI, technology, creator life, and internet work. Shopify remains the source of truth for commerce. The RBS site should provide context and discovery—not a duplicate catalog, cart, checkout, inventory, or policy system.

### Assumptions

- RBS begins with one primary author/editor and a sustainable weekly publishing rhythm.
- The current Next.js site can be redesigned later, but its platform and hosting are not decided by this model.
- Production Shopify and its product data remain out of scope for content-model implementation until separate staging and commerce approvals exist.

## Shared content contract

Every publishable entry uses a common set of fields; individual types add fields below.

| Field | Requirement |
| --- | --- |
| `title` | Required. Specific, descriptive, and not clickbait. |
| `slug` | Required, stable, lower-case URL segment. Never reuse a published slug for unrelated content. |
| `summary` | Required. One-to-two-sentence reader value statement. |
| `editorial_lens` | Required enum: `security`, `internet`, or `goods`. |
| `format` | Required enum from the lean format set below. |
| `topics` | Required one primary topic; optional one secondary topic. |
| `series` | Required controlled article series. Choose one: `operational-readiness`, `bad-defaults`, `human-layer`, `attack-surface`, `incident-reality`, or `security-theater`. |
| `author` | Required display name/byline; optional author profile reference. |
| `published_at`, `updated_at` | Required publication date; optional update date with a meaningful change note. |
| `status` | Required: `draft`, `in_review`, `scheduled`, `published`, or `retired`. |
| `hero_media` | Required for explainers, opinion, series, campaigns, and product-linked entries; optional for notes. |
| `sources` | Required when factual claims materially rely on external evidence; optional but encouraged for commentary. |
| `disclosures` | Required when sponsored, affiliate, gifted, or product-promotional context applies. |
| `seo` | Required title and description; optional canonical URL, no-index flag, social image, and structured-data eligibility. |

**Accessibility rule:** every non-decorative image requires concise, context-appropriate alt text; video requires captions or a transcript; audio needs a transcript; embeds need a text summary or equivalent path to the information. Decorative media uses empty alt text rather than invented descriptions.

## Content types

### Short note / social-post expansion

- **Purpose and audience:** preserve a useful social observation for readers who want context, links, or a durable reference.
- **Required fields:** shared contract; body; original social/video URL and date when adapted; one clear takeaway.
- **Optional fields:** pull quote, one supporting chart/image, related series, correction note.
- **SEO:** `noindex` is recommended for very short, time-sensitive notes with no durable search value; otherwise use a descriptive title/summary, never the raw social-post text.
- **Taxonomy:** one primary topic; `format:note`; optional series; security or internet lens.
- **URL:** `/notes/{slug}`.
- **Relationships and Shopify:** show 2–3 related entries. A Goods link appears only when the idea genuinely relates to a product/design; it links to a Shopify collection or product page with disclosure where appropriate.
- **Lifecycle:** draft → source/tone review → published; promote a note into an explainer when the topic earns deeper treatment.

### Video companion

- **Purpose and audience:** make a video searchable, accessible, and useful after its social distribution window.
- **Required fields:** shared contract; video host URL; duration; transcript or caption source; summary; three key points.
- **Optional fields:** chapters, embedded clip, companion resources, downloadable checklist.
- **SEO:** unique title/description; eligible video structured-data fields only after implementation is separately approved; include thumbnail alt/context.
- **Taxonomy:** one primary topic; `format:video`; optional series; security or internet lens.
- **URL:** `/videos/{slug}`.
- **Relationships and Shopify:** link to the related note/explainer; product links stay below the editorial material and never interrupt the video summary.
- **Lifecycle:** draft → accuracy/caption review → published → update transcript when video corrections are necessary.

### Long-form security explainer

- **Purpose and audience:** give practitioners, builders, and leaders a durable, source-backed explanation plus practical improvement steps.
- **Required fields:** shared contract; problem statement; scope/limitations; sourced body; practical actions; source list; update note when relevant.
- **Optional fields:** diagrams, glossary, checklist, “what this does not mean,” and related advisories.
- **SEO:** descriptive title and meta description; canonical URL; eligible article structured data after separate approval; never optimize a headline beyond what evidence supports.
- **Taxonomy:** one security topic; `format:explainer`; optional `Security, Actually` or `Bad Defaults` series.
- **URL:** `/security/{slug}`.
- **Relationships and Shopify:** related explainers and notes first. Product links are exceptional and only allowed when a specific design has genuine, disclosed editorial context.
- **Lifecycle:** draft → factual/source review → editorial review → published; re-review when a material source, advisory, or recommendation changes.

### Opinion / commentary

- **Purpose and audience:** make a clear RBS point about incentives, technology, platforms, AI, or culture without confusing opinion for reporting.
- **Required fields:** shared contract; explicit thesis; `Opinion` label; evidence/links for material factual premises.
- **Optional fields:** counterargument, embedded post/video, response/update note.
- **SEO:** descriptive title/summary; do not use inflammatory claims or personalized attacks to earn clicks.
- **Taxonomy:** one primary topic; `format:commentary`; security or internet lens; optional series.
- **URL:** `/commentary/{slug}`.
- **Relationships and Shopify:** related commentary and a series index; optional product link only where it supports the editorial premise and is plainly promotional.
- **Lifecycle:** draft → tone/factual-premise review → published; corrections append a dated clarification.

### Recurring editorial series

- **Purpose and audience:** create a recognizable home for recurring security or internet-work observations.
- **Required fields:** title; stable slug; one-sentence premise; editorial lens; series editor/owner; inclusion rule; card image with accessible alt text.
- **Optional fields:** cadence, archive introduction, featured entry, linked Goods theme.
- **SEO:** evergreen title/description and canonical series index.
- **Taxonomy:** `format:series`; one lens; series itself becomes the controlled relationship rather than another free-form tag.
- **URL:** `/series/{slug}`; entries retain their type-specific URLs.
- **Relationships and Shopify:** series page shows entries first and may include one restrained Goods context block below the archive.
- **Lifecycle:** draft → editorial approval → published; retired series stays accessible with a clear archive notice.

### Campaign / drop page

- **Purpose and audience:** connect a campaign, recurring idea, or merchandise drop to its commentary without replacing Shopify.
- **Required fields:** shared contract; campaign premise; linked article/note set; explicit Shopify collection or product URLs; disclosures; availability language supplied by Shopify rather than duplicated.
- **Optional fields:** design rationale, video, limited-time editorial note, campaign artwork.
- **SEO:** descriptive campaign title/summary; avoid product price, availability, or countdown claims that can go stale.
- **Taxonomy:** `format:campaign`; typically `goods` lens; one related security or internet topic allowed.
- **URL:** `/goods/{slug}`.
- **Relationships and Shopify:** use direct Shopify links and clearly identify them as shop links. Do not fetch, cache, or restate catalog facts until a later approved integration design exists.
- **Lifecycle:** draft → disclosure/brand review → published; mark retired drops as archived and retain editorial context without stale purchase prompts.

### Product-linked editorial content

- **Purpose and audience:** explain the thought, series, or cultural observation behind a product for readers who care about the context.
- **Required fields:** shared contract; explicit editorial thesis; relationship to campaign/design; disclosure if promotional; Shopify URL.
- **Optional fields:** sample/process images, related series, creator note.
- **SEO:** treat as an editorial page, not a duplicate product page; no duplicate product description or structured product data.
- **Taxonomy:** primary editorial topic plus `format:product-context`; `goods` lens.
- **URL:** `/goods/{slug}` or `/commentary/{slug}` based on the primary reader value; never publish the same item at both paths.
- **Relationships and Shopify:** one primary Shopify CTA after the editorial content; optional related articles. Shopify owns price, availability, variants, cart, checkout, returns, and fulfillment.
- **Lifecycle:** draft → brand/disclosure review → published; update or retire the CTA when the linked Shopify item changes.

### Static pages

| Page | Purpose | Required content | URL |
| --- | --- | --- | --- |
| About | Explain the RBS premise, author/editor identity, and editorial scope | mission, byline, scope, contact route | `/about` |
| FAQ | Answer common reading, content, and commerce-routing questions | content labels; where commerce/support lives; no duplicate Shopify policy text | `/faq` |
| Contact / support | Route editorial inquiries and commerce support correctly | editorial contact; Shopify order/policy/support links; expected response boundaries | `/contact` |
| Editorial standards / corrections | Explain sources, labels, updates, disclosures, and corrections | standards; correction process; disclosure policy | `/standards` |

Static pages use draft → owner review → published. They are reviewed at least when policies, support ownership, or disclosure practices change.

## Lean taxonomy

Use controlled fields, not a broad tag cloud.

- **Editorial lens (one):** `security`, `internet`, `goods`.
- **Format (one):** `note`, `video`, `explainer`, `commentary`, `campaign`, `product-context`, `series`, `static`.
- **Primary topic (one):** `identity-access`, `security-operations`, `secure-by-default`, `ai`, `platforms`, `creator-life`, `internet-work`, or `culture`.
- **Secondary topic (zero or one):** same controlled set, only where it changes discovery value.
- **Series (zero or one):** controlled references such as `security-actually`, `bad-defaults`, `ai-safely`, `field-notes`, or `goods-with-receipts`.

Do not add personal names, vendors, trends, products, or one-off jokes as taxonomy. Use body text and internal search for those details until evidence shows a controlled topic is needed.

## Relationships and reusable modules

**Relationships:** author ↔ entries; series ↔ entries; entry ↔ related entries; entry ↔ campaign; campaign ↔ Shopify URL(s). Links should be editorially chosen, not generated solely by shared tags.

**Reusable modules:** source list; correction/update note; disclosure notice; related-content list; series banner; video transcript; pull quote; Shopify context link; author box; and a content-label badge. Each module must have accessible heading/labeling and work without client-side tracking.

## Initial content location recommendation

**Recommendation:** begin with repository-managed Markdown/MDX content and a small, versioned front-matter schema. It gives one author transparent review through Git, portable files, reliable rollback, and no new vendor, credentials, or CMS configuration while the information architecture is still being proven.

| Option | Benefits | Tradeoffs |
| --- | --- | --- |
| Repository Markdown/MDX (recommended initially) | Version history, reviewable changes, no new service, portable content | Publishing requires a repository workflow; non-technical collaboration is less convenient |
| Lightweight headless CMS (revisit after cadence is proven) | Friendly authoring, drafts, asset workflow, possible editorial collaboration | New vendor/access/secrets, content-model lock-in, preview and backup design required |
| Social platform as the primary archive | Lowest immediate effort | Poor durability, ownership, search, citation, accessibility, and relationship modeling |

Revisit a CMS only after 8–12 published entries or when collaboration/asset workflow demonstrably exceeds the repository approach. Any CMS choice requires a separate architecture and security review.

## Migration treatment for the current site

**Verified current surface:** [`app/page.tsx`](/Users/mattgnelson/Developer/rootstock/reallybadsecurity-site/app/page.tsx) composes a one-page site from Hero, Content, Medium, YouTube, Shop, About, Newsletter, and Footer components. [`app/components/Shop.tsx`](/Users/mattgnelson/Developer/rootstock/reallybadsecurity-site/app/components/Shop.tsx) presents four Shopify-linked product cards; [`app/api/shop/route.ts`](/Users/mattgnelson/Developer/rootstock/reallybadsecurity-site/app/api/shop/route.ts) supplies them. [`app/api/youtube/route.ts`](/Users/mattgnelson/Developer/rootstock/reallybadsecurity-site/app/api/youtube/route.ts) supports the current video section.

**Recommendation:** preserve existing public URLs and any valuable copy until a redirect/content inventory is reviewed. Reframe the single-page sections as migration inputs: Hero becomes the home/content-hub proposition; Content/Medium/YouTube become candidate feeds or video-companion modules; Shop becomes a restrained Goods context module; About/Footer provide inputs for static pages. Treat Newsletter as undecided until the owner approves capture, consent, and provider handling. Do not retain the current arbitrary four-product card behavior as the future commerce model.

## Lifecycle and acceptance criteria

### Standard lifecycle

`draft` → `in_review` (source, tone, disclosure, accessibility) → `scheduled` → `published` → `updated` or `retired`.

Published edits that materially change facts, recommendations, disclosures, or a product CTA require a dated update note. Retired content remains reachable where practical and says why it is archived.

### Acceptance criteria for a future implementation

- Every content type can express all required shared and type-specific fields without bespoke one-off structures.
- Routes follow the proposed pattern or have an approved documented exception.
- Security guidance can display sources, scope/limitations, updates, and corrections.
- Opinion, satire, and promotion have visible, accessible labels.
- All media has the required text alternative, captions, or transcript.
- Product-linked content uses Shopify links without duplicating product facts or checkout.
- The model supports the minimum viable launch inventory in the editorial strategy.
- Draft/review/publish access and rollback are documented before any CMS or deployment work.

## Owner decisions

- Confirm whether the primary byline is an individual, “RBS,” or both.
- Approve the initial series names and topic set.
- Decide which existing public pages/content should be retained, rewritten, redirected, or archived after a content inventory.
- Decide whether newsletter/contact capture is in scope and, if so, its consent and support owner.
- Approve the review threshold for sensitive security subjects and sponsored/affiliate content.

## Smallest safe implementation task after approval

Create one repository-only **draft content fixture** and one validation checklist for a `note` entry under the approved schema. Do not wire it into application routing, modify code, deploy, create CMS content, or connect Shopify.
