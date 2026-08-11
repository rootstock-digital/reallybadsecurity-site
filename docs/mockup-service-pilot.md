# Rootstock Digital mockup-service pilot

**Status:** focused staging builder in progress. Artwork uploads are stored in an isolated R2 bucket; Shopify draft creation is approval-gated and staging-only. Mockup generation and media upload to Shopify remain the next implementation steps. This document does not authorize production publishing or Printful changes.

## Pilot objective

Prove a repeatable workflow for turning an approved design into a secure, reusable, Shopify-ready product-media package.

The reference design is **Vibe Codes Only**. The pilot should test the workflow—not introduce a new catalog family or change a live product.

## Pilot product

| Field | Value |
| --- | --- |
| Draft title | `Vibe Codes Only — Heavyweight Tee` |
| Design code | `VCO` |
| Format | Heavyweight short-sleeve tee |
| Initial color | Black or another owner-approved dark blank |
| Initial placement | Front print; confirm final print area in Printful |
| Product state | Draft / unpublished |
| Fulfillment | Printful, only after blank and print method are verified |
| Source artwork | `public/media/merch/designs/vibe-codes-only/vibe-codes-only.svg` |
| Raster artwork | `public/media/merch/designs/vibe-codes-only/vibe-codes-only.png` |
| Supporting source | `public/media/merch/designs/vibe-codes-only/vibe-codes-only.pdf` |

The SVG is the preferred scalable source. The 4500 × 4500 PNG is the raster fallback and must retain transparency. Do not edit the source artwork in place; export derivatives into a separate working area and keep the original files unchanged.

## Required mockup package

1. Accurate front product mockup showing the actual Vibe Codes Only artwork.
2. Plain product or print-detail view that makes the garment and placement easy to assess.
3. Optional back view only if the product has back decoration.
4. Size-guide or specification image supplied by the blank manufacturer.
5. One custom RBS lifestyle/campaign scene using the same approved product and artwork.
6. Accessibility-ready alt text for every image.
7. A short provenance record containing source artwork, blank, print method, scene, date, and approval state.

The accurate product view should be the first image. Lifestyle imagery is supporting media and must not be used to imply a different garment, color, placement, or print method.

## Reusable scene direction

Create one reusable scene rather than a design-specific composition:

- dark navy or warm neutral base;
- restrained RBS orange accent;
- believable desk, notebook, keyboard, or workspace props;
- editorial/product-photography composition rather than generic influencer imagery;
- no third-party logos, recognizable software interfaces, or copied vendor UI;
- enough negative space for different product silhouettes and print placements;
- no generated text added to the scene—the artwork itself is the source of truth.

The scene should be reusable for future tees, hoodies, and mugs, with product-specific placement handled by the mockup tool.

## Security and approval gates

The Goods module stores each mockup project as a D1 workflow record after an authorized operator creates it. Uploaded artwork is validated and stored in the isolated staging `GOODS_ASSETS` R2 bucket. Assets and approval gates are normalized records, and every mutation requires the current workflow version. A stale form is rejected, and successful changes append an audit event with actor, action, version, and timestamp.

The RBS repository includes automated Goods tests for the authorization policy, approval gates, optimistic conflicts, successful version increments, audit events, and workflow-template isolation. Keep these tests passing as the mockup provider is added.

The first Shopify adapter is plan-first: it creates a draft-only `productCreate` request only from an approved Goods workflow, includes traceable workflow/design tags, and does not publish the product. It uses a separate Shopify Dev Dashboard app with only the minimum `write_products` scope. The Worker stores the app's client ID and secret as secrets, exchanges them for a short-lived Admin API token at runtime, and never stores that token in source control. The protected confirmation action is available in staging; Shopify media upload is not yet enabled.

- Use only the isolated test store and test fulfillment connection.
- Never place Shopify, Printful, or storage credentials in the repository, image metadata, filenames, or screenshots.
- Use the minimum required account permissions and record who performed each external action.
- Treat uploaded artwork as untrusted input: validate file type, dimensions, transparency, and file size before handoff.
- Keep production artwork separate from promotional mockups; a mockup is not a print file.
- Do not publish until artwork, blank, print method, product media, price inputs, fulfillment window, and physical sample are approved.
- Record any AI-generated lifestyle asset as promotional imagery and verify that it does not misrepresent the deliverable product.

## Acceptance criteria

The pilot is successful when:

- the artwork survives the Printful import without altered wording or unexpected cropping;
- the selected blank, color, placement, and print method match the draft product;
- the custom scene can be reused with another product without rebuilding it;
- Shopify displays the intended primary image and supporting gallery;
- the product remains draft-only until explicit owner approval;
- a physical sample confirms color, scale, placement, garment, and print quality; and
- another operator can repeat the workflow from this brief without relying on hidden steps.

## Next operational step

Next: add the product-type selector and controlled mockup-generation adapter. The accurate product view must preserve the uploaded artwork exactly; optional AI lifestyle scenes must be clearly marked promotional. Then attach the approved mockup assets to the Shopify draft. Do not sync or publish until the acceptance checklist is complete.
