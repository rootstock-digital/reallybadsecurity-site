# RBS website redesign brief

**Status:** review-only recommendation. This brief authorizes no application, Shopify, Cloudflare, analytics, deployment, or production-content changes.

## Verified current facts

- The current home page is a single-page composition of navigation, hero, About, ticker, Shop, YouTube, Medium, newsletter, and footer components in [`app/page.tsx`](/Users/mattgnelson/Developer/rootstock/reallybadsecurity-site/app/page.tsx).
- Current navigation uses in-page links for About, Shop, and Content plus an outbound Shopify CTA ([`app/components/Nav.tsx`](/Users/mattgnelson/Developer/rootstock/reallybadsecurity-site/app/components/Nav.tsx)).
- The visual system currently uses a dark navy field, orange accent, grid/glow motifs, a floating shield, a rotating ring, and a hover glitch effect ([`app/components/Hero.tsx`](/Users/mattgnelson/Developer/rootstock/reallybadsecurity-site/app/components/Hero.tsx)).
- The existing content surface includes podcast, Medium, YouTube, newsletter, and outbound Shopify elements. The editorial and content-model documents propose a future multi-route content hub; no such routes are implemented.

## Experience strategy

### Primary job

Make RBS the place where a reader can quickly understand a security or technology problem, get one practical improvement, and recognize a distinct dry point of view. The secondary job is to turn a social/video audience into a durable readership. Goods are a supporting expression of the audience—not the home-page conversion goal.

### Audience and first impression

Primary: security practitioners, builders, leaders, AI/technology workers, and online creators who appreciate useful analysis without corporate theater. A first-time visitor should think: **“This is credible, readable, and has an actual opinion.”** Within 20 seconds they should find a current piece, understand the editorial labels, and see that RBS is not a consultancy landing page or generic merch shop.

### Feel and avoid

**Feel:** editorial, signal-rich, intentionally imperfect, technically literate, calm under pressure, and funny in the margins.

**Avoid:** generic cybersecurity, neon hacker clichés, fake terminal decoration, corporate SaaS blandness, generic merch-store styling, fear-driven language, over-animated interfaces, and humor that obscures an important fact.

### Editorial, video, and Goods balance

- Home prioritizes latest/featured editorial work (about 70% of visible hierarchy), then video/series (about 20%), then a single contextual Goods module (about 10%).
- Every security claim retains sources, limitations, and correction behavior; humor is a framing device, not evidence.
- Video gets a companion page or transcript path, not an opaque embed wall.
- Goods appears where a design has earned context through a series or campaign. Shopify owns the actual commerce interaction.

## Information architecture

### Recommended top navigation

`Home` · `Security` · `Internet` · `Field Notes` · `Goods` · `About`

Utility/footer: `Editorial standards`, `Contact`, `Shop support`, and Shopify policy links. Search is a later decision; do not add it until content volume justifies it.

### Hierarchy and user journeys

```text
Home
├── Security
│   ├── Explainer / note
│   └── Series: Security, Actually; Bad Defaults
├── Internet
│   ├── Commentary / video companion
│   └── Series: AI, Safely; Internet Work
├── Field Notes
│   └── Short, durable social expansions
├── Goods
│   ├── Campaign / design context
│   └── Shopify collection or product handoff
└── About / standards / contact
```

Key journeys:

1. **Social visitor:** social post → matching note/explainer → related work → optional series subscription/contact decision.
2. **Security reader:** Security index → sourced explainer → practical action → related note/series; no forced shop CTA.
3. **Video viewer:** video companion → transcript/key points → related analysis → optional Goods context.
4. **Goods-curious reader:** campaign context → Shopify collection/product link → Shopify handles catalog, cart, checkout, and support.

### Change from the current one-page surface

Replace in-page-section navigation with durable routes and indexes. Preserve the current page’s useful source material during content inventory, but stop treating podcasts, external feeds, product cards, and newsletter capture as equally important home-page blocks. RBS / Internet / Goods are editorial lenses and routes—not three competing brands or separate sites.

## Visual direction proposals

### A. Editorial signal desk — **recommended**

**Idea:** a compact digital magazine that looks like someone with good taste annotated a security incident report.

- **Typography:** expressive editorial serif for feature headlines paired with a neutral grotesk/sans for navigation and data; monospaced type only for actual metadata, source dates, and short labels.
- **Color:** near-black/navy base, warm paper/sand reading surface, one burnt-orange signal accent, muted blue-gray supporting tones. Use red only for real warning/correction states.
- **Layout:** strong reading column, generous whitespace, asymmetrical feature grid, thin rules, source rails, and small labeled modules.
- **Imagery:** original diagrams, editorial photography, simple annotated objects, and occasional human-scale images. Never vendor dashboard replicas.
- **Motion:** restrained reveal on entry, optional low-motion progress indicator, no continuous decorative animation. Respect reduced motion.
- **Icons/interactions:** simple line symbols for source, video, correction, and shop-link labels; clear text CTAs; hover states that clarify rather than perform.
- **Why it fits:** makes credibility visible while leaving room for dry editorial humor and a culture brand.

### B. Field manual / annotated notebook

**Idea:** an evolving, well-kept operator’s field manual where notes, corrections, and marginalia are part of the personality.

- **Typography:** highly legible sans body; slab/mono labels; occasional marker-like display face only for callouts, not long prose.
- **Color:** off-white background, ink-black text, safety-orange annotations, desaturated olive/blue utilities.
- **Layout:** cards as loose sheets, visible update/source blocks, inline callout tabs, stacked mobile reading flow.
- **Imagery:** photographed notebooks, diagrams, checklists, imperfect but intentional texture.
- **Motion:** page-turn or underline effects only if they remain accessible and nonessential.
- **Icons/interactions:** stamps for `Opinion`, `Source-backed`, `Updated`, and `Goods context`.
- **Risk:** can become kitsch or lower perceived authority if texture overwhelms reading and sources.

### C. Clean late-night broadcast

**Idea:** an understated technology broadcast: high-contrast, organized, and slightly nocturnal, with the wit carried by the copy.

- **Typography:** large condensed sans headlines and highly readable neutral body type.
- **Color:** deep charcoal, electric-but-muted cobalt, cream, and a single warm highlight.
- **Layout:** modular feed, large video tiles, time-stamped cards, crisp dividers, generous mobile cards.
- **Imagery:** deliberate stills, wide video crops, minimal graphic overlays, no digital-noise effects.
- **Motion:** subtle marquee/progress behavior only after accessibility validation; otherwise static and fast.
- **Icons/interactions:** broadcast-style labels and play/source indicators.
- **Risk:** can drift into generic media-network branding without distinctive editorial voice and original imagery.

**Recommendation:** Direction A, *Editorial signal desk*. It is the best vehicle for long-form credibility, short-form personality, source presentation, and restrained Goods links. Borrow Direction B’s visible update/source affordances, not its texture-heavy visual language.

## Page-level recommendations

### Home

```text
Header / clear editorial promise
Featured analysis (one story, summary, source/opinion label)
Latest from Security + Internet (curated, not an endless feed)
Video / Field Note spotlight
Series strip
One contextual Goods module
Standards / about / support footer
```

The hero should state the RBS premise and offer a primary “Read the latest” path. Avoid email capture or commerce as the immediate primary CTA until owner decisions and consent requirements are settled.

### Content index and article

Indexes should filter first by Security and Internet, then surface series/format. Every article has a content label, byline/date/update, summary, reading time only if reliable, source/correction module, related editorial work, and a restrained end-of-article Goods context link where relevant.

### Video companion

Lead with title, summary, duration, and accessible video; follow with key points and transcript. Do not bury the content under a large autoplay embed. Place related analysis below the transcript.

### Campaign / drop page

Use an editorial premise, design rationale, related series entries, and one or two explicit Shopify links. Do not display price, availability, variants, cart controls, or checkout on RBS. Mark promotion/disclosures clearly.

### About

Explain the RBS premise, editorial lenses, author/byline, standards, and what RBS is not. It should establish trust without reading like a consulting-services page.

### Shop handoff

The header’s `Goods` route provides context; a persistent but secondary `Shop` outbound CTA can open Shopify. Shopify pages own customer support, policy, product, and transactional facts. RBS can route pre-purchase editorial/contact questions but must not absorb order support.

### Support and policy routing

Footer links distinguish editorial contact, corrections, and Shopify order/support/policy links. Never duplicate Shopify return, shipping, payment, privacy, or product-policy copy on RBS; link to the applicable Shopify canonical page instead.

## Accessibility, responsive, performance, and SEO principles

- **Accessibility:** semantic landmarks and headings; visible keyboard focus; skip link; minimum WCAG AA contrast; reduced-motion support; text alternatives; captions/transcripts; clearly labeled external Shopify links; errors/status messages announced accessibly.
- **Responsive:** design mobile reading first; make navigation, source modules, tables, images, and video transcripts work without horizontal scrolling; preserve reading order when grids collapse.
- **Performance:** prioritize text and hero image; reserve media dimensions; avoid autoplay, heavy client-only animation, unnecessary third-party embeds, and font overload; lazy-load noncritical media; keep Shopify handoffs as links until approved integration work.
- **SEO:** stable content-type URLs; individual titles/descriptions/canonicals; visible authorship/date/updates; source-rich explainers; accessible video transcript; intentional internal linking; no duplicate Shopify product metadata or stale commerce claims.

## Phased sequence

| Phase | Scope | Acceptance criteria | Approval / boundary |
| --- | --- | --- | --- |
| 0. Direction decision | Choose a visual direction and confirm navigation/priority | Owner signs off on Direction A or documented alternative | No code or platform change |
| 1. Content inventory | Classify current page sections, external links, and existing copy as retain/rewrite/archive/redirect candidate | Inventory and redirect decisions are reviewable | No production-content change |
| 2. Design foundation | Create a review-only sitemap, low-fidelity wireframes, and component inventory | Home, index, article, video, Goods, About, and support flows are covered | Can be artifacts only; no Shopify/Cloudflare work |
| 3. Content fixtures | Prepare repository-only draft fixtures matching the approved content model | Fields, labels, source/correction blocks, and media requirements are testable | No routes or deployment |
| 4. Implementation design | Plan responsive components, metadata, and migration/redirect work | Accessibility/performance/SEO checklist and rollback plan approved | Requires separate implementation authorization |
| 5. Staged build and validation | Build only after approved staging and content workflow exist | Staging review passes; Shopify remains an external handoff | Separate code/deploy/Shopify approvals |

### Smallest safe website-design implementation task

Create low-fidelity, review-only wireframes for Home, article, Security index, and Goods campaign page using the recommended direction. Include mobile states and annotated source/disclosure/Shopify-link behavior. Do not alter code or create a Figma artifact without a separate owner request.

## Owner decisions

- Approve the recommended direction or choose B/C.
- Confirm the first-time visitor priority: latest analysis, featured series, or video.
- Confirm whether `Internet` is a top-level navigation item or a more subtle editorial lens beneath Field Notes.
- Choose the primary byline and photography/illustration budget/source.
- Decide whether newsletter capture returns, and if so approve its consent, provider, and owner.
- Approve the treatment of current external Medium, YouTube, podcast, Suno, and Shopify links after inventory.
- Approve the criteria for when Goods may appear on editorial pages.
