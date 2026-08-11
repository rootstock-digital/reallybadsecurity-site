import { assertGoodsReadyForShopifyDraft } from "./goods.policy";
import type { GoodsWorkflowRecord } from "./goods.types";
import type { ShopifyDraftProductPlan } from "./shopify.types";

export function createShopifyDraftProductPlan(workflow: GoodsWorkflowRecord): ShopifyDraftProductPlan {
  if (workflow.status !== "approved") {
    throw new Error("The Goods workflow must be approved before creating a Shopify draft.");
  }
  assertGoodsReadyForShopifyDraft(workflow);
  return {
    workflowId: workflow.id,
    title: workflow.productTitle,
    vendor: "Really Bad Security",
    productType: workflow.format,
    status: "DRAFT",
    tags: [`goods-workflow:${workflow.id}`, `design-code:${workflow.designCode}`],
    description: `${workflow.designName} draft prepared from the approved Goods workflow. Product media and fulfillment details require separate verification.`,
  };
}
