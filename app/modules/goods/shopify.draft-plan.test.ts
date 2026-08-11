import { describe, expect, it } from "vitest";

import { createShopifyDraftProductPlan } from "./shopify.draft-plan";
import type { GoodsWorkflowRecord } from "./goods.types";

const workflow = (status: GoodsWorkflowRecord["status"]): GoodsWorkflowRecord => ({
  id: "workflow-1", version: 4, designName: "Vibe Codes Only", designCode: "VCO", productTitle: "Vibe Codes Only — Heavyweight Tee", format: "Heavyweight short-sleeve tee", status, sourceOfTruth: "client-workflow",
  assets: [], approvalGates: [{ id: "design", label: "Design", required: true, status: "passed" }],
});

describe("Shopify draft product plan", () => {
  it("requires an approved Goods workflow", () => {
    expect(() => createShopifyDraftProductPlan(workflow("draft"))).toThrow("must be approved");
    expect(() => createShopifyDraftProductPlan(workflow("in_review"))).toThrow("must be approved");
  });

  it("creates a draft-only plan with traceable tags", () => {
    const plan = createShopifyDraftProductPlan(workflow("approved"));
    expect(plan.status).toBe("DRAFT");
    expect(plan.tags).toEqual(["goods-workflow:workflow-1", "design-code:VCO"]);
    expect(plan.vendor).toBe("Really Bad Security");
  });
});
