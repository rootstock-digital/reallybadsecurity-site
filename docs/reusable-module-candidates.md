# Reusable module candidates

**Status:** RBS implementation record and Rootstock Starter promotion candidate. This document does not authorize a Starter change.

## Paired editorial and video series preview

RBS has established a paired home-page pattern for an editorial series preview and a video-series preview. Both use the same 16:9 media frame and card geometry, while RBS-specific colors, typography, copy, and data sources remain local to this site.

### RBS owns

- Security Signals terminology, series values, cover treatment, and article writing workflow.
- Podcast names, YouTube playlist choices, descriptions, and RBS visual color inversion.
- Editorial preview gating: in-review content is visible only in non-production when `EDITORIAL_PREVIEW=true`.

### Potential Starter responsibilities

- A neutral series-preview composition that accepts a heading, media-card renderer, item list, and responsive 16:9 media-frame contract.
- A neutral content-card interface with title, summary, metadata, destination, and optional media.
- A provider boundary for video feeds so rendering does not depend directly on YouTube or any single API.

### Promotion gates

Do not extract this into Rootstock Starter until:

1. A second client needs the same series-preview behavior.
2. The generic interface can avoid RBS terminology, colors, and editorial taxonomy.
3. Video retrieval is separated from YouTube-specific configuration.
4. Accessibility, empty/error states, responsive behavior, and media sizing are documented and tested.
5. The Starter addition can ship as a focused module with a release note.

Until then, maintain the pattern in RBS and use it as implementation evidence for a later Starter module.
