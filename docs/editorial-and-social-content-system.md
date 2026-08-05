# RBS editorial and social-to-site content system

**Status:** planning proposal. This document authorizes no website, Shopify, analytics, integration, or deployment changes.

## Premise and brand architecture

**Really Bad Security** is real, useful security analysis with practical ways to make things better—and restrained humor about the absurdity along the way. Core premise: **“Most security is really bad. Here’s how to make it better—and laugh at the absurdity along the way.”**

**Really Bad Internet** is the adjacent commentary desk: AI, platforms, creator life, technology, and internet work. It is technically literate and opinionated, but does not pretend every observation is a security finding.

**Really Bad Goods** is the supporting merchandise channel. Goods should extend a recurring idea, series, or audience in the editorial work; it is not the primary purpose of the site and should never turn an article into a product listing.

## Editorial pillars

| Pillar | Audience and purpose | Tone | Example topics | Content label |
| --- | --- | --- | --- | --- |
| Security, Actually | Practitioners, builders, and leaders; explain a real security failure mode and a practical improvement | Precise, candid, useful | access-review failures; insecure defaults; incident lessons; threat-model basics | Evidence-based guidance |
| Bad Defaults | Anyone affected by bad systems; name the design or organizational choice that made failure likely | Sharp, restrained, constructive | dark patterns in account recovery; “security theater”; unowned SaaS | Analysis / opinion, clearly labeled |
| AI, Safely | AI users and builders; separate useful AI practice from magical thinking | Curious, skeptical, technically literate | sensitive data in prompts; human review; model-output overtrust | Guidance or opinion, clearly labeled |
| Internet Work | Creators, operators, and online workers; make sense of platforms and publishing | Wry, observant, non-bitter | distribution uncertainty; building in public; context collapse | Commentary / satire |
| Field Notes | Existing audience; create an ongoing home for observations and source-backed reactions | Brief, conversational, specific | a useful thread expanded with sources; a conference observation; a chart with context | Note or video companion |
| Goods With Receipts | Interested readers; connect a product to an existing recurring idea | Light touch; no hard sell | design rationale; sample-review note; a drop tied to a series | Merch promotion, clearly labeled |

**Boundary:** guidance must distinguish facts, cited evidence, and uncertainty. Opinion identifies itself as opinion. Satire never masquerades as factual reporting. Merch promotion is labeled and does not carry security claims.

## Social-to-site workflow

1. Publish the short social post, video, or observation where it best fits the conversation.
2. Promote it to the RBS site only when it has durable utility: a repeatable lesson, sourceable claim, useful framework, relevant archive value, or a continuing series.
3. Capture the original link/date, a one-line thesis, content label, audience, and sources before drafting.
4. Create one of three lightweight site formats:
   - **Note:** 300–700 words; one observation, links, and a clear takeaway.
   - **Explainer:** 900–1,800 words; context, evidence, practical next step, and limitations.
   - **Campaign page:** a recurring-series or product-context page; links to related notes and a Shopify collection without duplicating product data.
5. Edit for permanence: remove platform-specific context that will age badly, add dates and sources, label opinion/satire/promotion, and give the page a descriptive title and summary.
6. Publish only after factual and tone review; link back to the originating post/video where useful.

### Selection criteria

Promote content when at least two are true: it answers a recurring question; gives a practical action; has credible sources; can be found later by a reader; opens a series; or expresses a durable RBS point of view. Keep content social-only when it is a fast reaction, personal exchange, unfinished thought, trend-dependent joke, or has no useful context beyond the platform.

### Sources and attribution

- Factual security claims need a primary source where practical: vendor advisory, CVE record, standards body, incident disclosure, original research, or official documentation.
- Cite the source near the claim, identify publication/event dates, and distinguish reported facts from RBS interpretation.
- Do not publish exploit instructions, sensitive operational details, or unverified allegations. Correct material errors with an updated note and date.
- AI/platform commentary may be opinion, but must not present speculation about algorithms, vendors, or people as fact.

## Formats, cadence, and minimum viable inventory

### Sustainable one-person cadence

- 2–3 social observations per week.
- 1 site note per week, usually adapted from the strongest social idea.
- 1 video or video companion every two weeks.
- 1 deeper explainer per month.
- 1 product-linked post only when it has genuine editorial context; never force a weekly merch promotion.

### Minimum viable launch inventory

- 1 durable “What is Really Bad Security?” page.
- 3 security notes, 2 AI/internet-work notes, and 1 deeper security explainer.
- 1 recurring-series landing page for **Bad Defaults** or **Field Notes**.
- 1 Goods/context page that links to Shopify rather than reproducing a catalog.
- About, contact, editorial standards, and disclosures pages.

## Site information architecture

**Proposed top navigation:** Home · Security · Internet · Field Notes · Goods · About.

**Taxonomy:** `security-actually`, `bad-defaults`, `ai-safely`, `internet-work`, `field-notes`, and `goods-with-receipts`. Add topic tags only when they improve retrieval; do not create a tag cloud.

**Essential page types:** home/content hub; topic index; article/note; video companion; series landing page; campaign/Goods context page; about; contact; editorial standards/corrections; disclosures; and Shopify policy/support links.

The RBS site should show a restrained, contextually relevant Shopify collection or product link near the end of a related article. Shopify remains the source of truth for product details, price, availability, cart, checkout, orders, policies, and fulfillment. The RBS site must not become a duplicate storefront.

## Voice and quality guardrails

| On-brand | Off-brand |
| --- | --- |
| “The control exists. Nobody owns it. That is the vulnerability.” | “Your company is definitely compromised.” |
| “AI can draft the answer. It cannot own the consequence.” | “AI is the future—buy this shirt.” |
| “Published, not promoted: a familiar state for internet work.” | “This platform shadowbanned us.” |
| “Here is the advisory, what it changes, and what it does not.” | “Breaking: this bug destroys security everywhere.” |

- Humor targets systems, incentives, and shared work absurdities—not victims of incidents or individual practitioners.
- Keep AI commentary specific; name uncertainty and avoid provider/UI mimicry, unsupported risk claims, or hype.
- Product copy cannot claim security, privacy, compliance, performance, quality, or fit without evidence and owner approval.
- Affiliate, sponsored, gifted, or compensated content requires a clear disclosure near the recommendation and a record of the relationship. Do not accept sponsorship that controls editorial conclusions.
- Community interaction should be generous, non-doxxing, and correction-friendly. Do not amplify unverified reports or turn a disagreement into a pile-on.

## Measurement, deferred tooling

Use a small, privacy-conscious manual scorecard first:

- Publishing consistency: planned versus published pieces.
- Content quality: source-complete rate, corrections, and meaningful replies/shares.
- Audience intent: newsletter/contact signups or direct reader responses, if and when an approved method exists.
- Commerce context: outbound Shopify collection/product-link clicks and attributed purchases only if privacy, consent, and implementation are separately approved.

Do not add analytics tools, pixels, session recording, ad tags, or other tracking in this work. Any analytics implementation requires separate approval, a documented purpose, data map, retention policy, consent approach, and owner.

## 30-day starter plan

| Week | Site idea | Video/social idea | Purpose |
| --- | --- | --- | --- |
| 1 | **What Really Bad Security Is For**: the premise, editorial labels, and correction standard | 45-second introduction: “Most security is really bad—not because people are bad.” | Establish the point of view. |
| 1 | **Bad Defaults #1: Nobody Owns the Admin Account** | Short post: “The password manager is not the owner.” | Practical security analysis. |
| 2 | **AI, Safely: Drafting Is Not Deciding** | Short video: three questions before treating model output as an answer | AI commentary with a usable framework. |
| 2 | **Field Note: Published, Not Promoted** | Social observation on distribution uncertainty; link to a short site note | Creator/internet-work voice. |
| 3 | **Security, Actually: The Access Review That Happens After the Incident** | Carousel/video companion: what to review before it becomes urgent | Deeper practical explainer. |
| 3 | **Goods With Receipts: Why “Least Privilege Club” Exists** | Product-adjacent social post; link to editorial context then Shopify collection | Connect merchandise to commentary without a hard sell. |
| 4 | **Bad Defaults #2: Recovery Is a Product Feature** | Short post on account recovery tradeoffs | Continue a recognizable series. |
| 4 | **Month-one Field Notes**: what held up, what changed, what needs a correction | Short video recap and invitation for reader questions | Close the loop and seed next month. |

## Next safe task and owner decisions

**Smallest safe website task:** create a review-only content-model specification for the current RBS site: proposed routes, page templates, fields, labels, and one sample note. It must not change application code or deploy anything.

**Owner decisions still needed:** which social platforms and audience segments are primary; the byline/editorial identity; whether a newsletter or contact capture is wanted; the correction/disclosure owner; the acceptable use of affiliates/sponsorships; review/approval threshold for sensitive security topics; and whether Goods launches with the first editorial series or later.
