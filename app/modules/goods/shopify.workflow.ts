import type { EditorialActor } from "../editorial-admin/editorial-admin.types";
import { GoodsProviderConflictError, type GoodsProviderRepository } from "./goods-provider.types";
import { createShopifyDraftProductPlan } from "./shopify.draft-plan";
import type { ShopifyAdminClient, ShopifyDraftProduct } from "./shopify.types";
import type { GoodsWorkflowRecord } from "./goods.types";

export type ShopifyDraftCreationResult = Readonly<{
  product: ShopifyDraftProduct;
  reused: boolean;
}>;

export async function createShopifyDraftWithIdempotency(
  workflow: GoodsWorkflowRecord,
  actor: EditorialActor,
  providerRepository: GoodsProviderRepository,
  adminClient: ShopifyAdminClient,
): Promise<ShopifyDraftCreationResult> {
  const plan = createShopifyDraftProductPlan(workflow);
  const idempotencyKey = `shopify:draft-product:${workflow.id}`;
  const reservationToken = crypto.randomUUID();
  const reservation = await providerRepository.reserveProviderOperation({ workflowId: workflow.id, idempotencyKey, requestHash: JSON.stringify(plan), reservationToken }, actor);
  if (reservation.status === "draft_created" && reservation.externalId && reservation.externalUrl) {
    return { product: { id: reservation.externalId, title: plan.title, handle: "", status: "DRAFT", adminUrl: reservation.externalUrl }, reused: true };
  }
  if (reservation.status !== "reserved" || reservation.reservationToken !== reservationToken) throw new GoodsProviderConflictError();

  try {
    const product = await adminClient.createDraftProduct(plan);
    await providerRepository.recordProviderDraftCreated({ workflowId: workflow.id, expectedVersion: reservation.version, reservationToken, externalId: product.id, externalUrl: product.adminUrl }, actor);
    return { product, reused: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Shopify returned an unknown error.";
    await providerRepository.recordProviderUnknown({ workflowId: workflow.id, expectedVersion: reservation.version, reservationToken, message }, actor).catch(() => undefined);
    throw error;
  }
}
