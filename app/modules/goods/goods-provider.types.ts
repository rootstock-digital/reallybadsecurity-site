import type { EditorialActor } from "../editorial-admin/editorial-admin.types";

export const goodsProviderStatuses = ["reserved", "draft_created", "unknown", "failed"] as const;
export type GoodsProviderStatus = (typeof goodsProviderStatuses)[number];

export type GoodsProviderRecord = Readonly<{
  workflowId: string;
  provider: "shopify";
  operation: "draft_product_create";
  version: number;
  idempotencyKey: string;
  requestHash: string;
  reservationToken: string;
  status: GoodsProviderStatus;
  externalId?: string;
  externalUrl?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}>;

export type GoodsProviderRepository = Readonly<{
  getProviderRecord(workflowId: string, provider: GoodsProviderRecord["provider"], operation: GoodsProviderRecord["operation"]): Promise<GoodsProviderRecord | null>;
  reserveProviderOperation(input: Readonly<{ workflowId: string; idempotencyKey: string; requestHash: string; reservationToken: string }>, actor: EditorialActor): Promise<GoodsProviderRecord>;
  recordProviderDraftCreated(input: Readonly<{ workflowId: string; expectedVersion: number; reservationToken: string; externalId: string; externalUrl: string }>, actor: EditorialActor): Promise<GoodsProviderRecord>;
  recordProviderUnknown(input: Readonly<{ workflowId: string; expectedVersion: number; reservationToken: string; message: string }>, actor: EditorialActor): Promise<GoodsProviderRecord>;
}>;

export class GoodsProviderConflictError extends Error {
  constructor(message = "This provider operation is already reserved or needs reconciliation.") { super(message); this.name = "GoodsProviderConflictError"; }
}
