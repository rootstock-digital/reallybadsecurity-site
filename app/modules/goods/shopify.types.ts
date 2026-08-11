import type { GoodsWorkflowRecord } from "./goods.types";

export type ShopifyDraftProductPlan = Readonly<{
  workflowId: string;
  title: string;
  vendor: string;
  productType: string;
  status: "DRAFT";
  tags: readonly string[];
  description: string;
}>;

export type ShopifyDraftProduct = Readonly<{
  id: string;
  title: string;
  handle: string;
  status: string;
  adminUrl: string;
}>;

export type ShopifyAdminClient = Readonly<{
  createDraftProduct(plan: ShopifyDraftProductPlan): Promise<ShopifyDraftProduct>;
}>;

export type ShopifyAdminConfig = Readonly<{
  storeDomain: string;
  clientId: string;
  clientSecret: string;
  apiVersion?: string;
}>;

export type GoodsProviderReference = Readonly<{
  workflowId: GoodsWorkflowRecord["id"];
  provider: "shopify";
  externalId: string;
  status: "draft_created";
  createdAt: string;
}>;
