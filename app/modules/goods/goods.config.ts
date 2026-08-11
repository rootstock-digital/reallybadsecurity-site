import type { GoodsWorkflowRecord } from "./goods.types";

export const vibeCodesOnlyPilot: GoodsWorkflowRecord = {
  id: "vibe-codes-only-heavyweight-tee",
  version: 1,
  designName: "Vibe Codes Only",
  designCode: "VCO",
  productTitle: "Vibe Codes Only — Heavyweight Tee",
  format: "Heavyweight short-sleeve tee",
  status: "draft",
  sourceOfTruth: "client-workflow",
  assets: [
    { id: "source-svg", kind: "source_artwork", label: "Scalable source artwork", status: "ready", sourceRef: "/media/merch/designs/vibe-codes-only/vibe-codes-only.svg", altText: "Vibe Codes Only artwork in orange, purple, turquoise, and yellow." },
    { id: "source-png", kind: "production_artwork", label: "Transparent raster artwork", status: "ready", sourceRef: "/media/merch/designs/vibe-codes-only/vibe-codes-only.png", altText: "Vibe Codes Only artwork in orange, purple, turquoise, and yellow." },
    { id: "front-mockup", kind: "product_mockup", label: "Accurate front product mockup", status: "missing" },
    { id: "detail-view", kind: "detail_view", label: "Print/detail view", status: "missing" },
    { id: "lifestyle-scene", kind: "lifestyle", label: "Reusable RBS lifestyle scene", status: "missing" },
    { id: "size-guide", kind: "size_guide", label: "Supplier size guide", status: "missing" },
    { id: "provenance", kind: "provenance", label: "Mockup provenance record", status: "in_progress" },
  ],
  approvalGates: [
    { id: "design", label: "Design and rights review", required: true, status: "passed" },
    { id: "blank", label: "Blank, color, print area, and method verified", required: true, status: "not_started" },
    { id: "mockup", label: "Mockup package reviewed", required: true, status: "not_started" },
    { id: "sample", label: "Physical sample approved", required: true, status: "not_started" },
    { id: "shopify", label: "Shopify draft product verified", required: true, status: "not_started" },
    { id: "publish", label: "Owner approves publication", required: true, status: "not_started" },
  ],
};

export function createGoodsWorkflowFromPilot(input: Readonly<{ id: string; designName: string; designCode: string; productTitle: string; format: string }>): GoodsWorkflowRecord {
  const isVibeCodesTest = input.designCode === "VCO-TEST";
  return {
    ...vibeCodesOnlyPilot,
    ...input,
    version: 1,
    status: "draft",
    sourceOfTruth: "client-workflow",
    assets: vibeCodesOnlyPilot.assets.map((asset) => ({ ...asset, id: `asset-${input.id}-${asset.id}`, status: "missing", sourceRef: isVibeCodesTest && (asset.kind === "source_artwork" || asset.kind === "production_artwork") ? asset.sourceRef : undefined, altText: isVibeCodesTest && (asset.kind === "source_artwork" || asset.kind === "production_artwork") ? asset.altText : undefined })),
    approvalGates: vibeCodesOnlyPilot.approvalGates.map((gate) => ({ ...gate, status: "not_started" })),
  };
}
