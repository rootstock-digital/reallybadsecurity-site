import { describe, expect, it, vi } from "vitest";

import { createShopifyDraftWithIdempotency } from "./shopify.workflow";
import type { GoodsWorkflowRecord } from "./goods.types";
import type { GoodsProviderRepository } from "./goods-provider.types";
import type { ShopifyAdminClient } from "./shopify.types";

const workflow: GoodsWorkflowRecord = {
  id: "workflow-1", version: 4, designName: "Vibe Codes Only", designCode: "VCO", productTitle: "Vibe Codes Only — Heavyweight Tee", format: "Heavyweight short-sleeve tee", status: "approved", sourceOfTruth: "client-workflow", assets: [], approvalGates: [{ id: "design", label: "Design", required: true, status: "passed" }],
};
const actor = { subject: "admin-1", roles: ["admin"] as const };

function providerRepository(overrides: Partial<GoodsProviderRepository>): GoodsProviderRepository {
  return { getProviderRecord: vi.fn().mockResolvedValue(null), reserveProviderOperation: vi.fn(), recordProviderDraftCreated: vi.fn().mockResolvedValue(undefined), recordProviderUnknown: vi.fn().mockResolvedValue(undefined), ...overrides };
}

describe("Shopify draft idempotency workflow", () => {
  it("reuses a durable draft reference without calling Shopify again", async () => {
    const provider = providerRepository({ reserveProviderOperation: vi.fn().mockResolvedValue({ workflowId: "workflow-1", provider: "shopify", operation: "draft_product_create", version: 2, idempotencyKey: "key", requestHash: "hash", reservationToken: "token", status: "draft_created", externalId: "gid://shopify/Product/1", externalUrl: "https://shop.example.com/admin/products/1", createdAt: "now", updatedAt: "now" }) });
    const admin = { createDraftProduct: vi.fn() } satisfies ShopifyAdminClient;
    const result = await createShopifyDraftWithIdempotency(workflow, actor, provider, admin);
    expect(result.reused).toBe(true);
    expect(result.product.id).toBe("gid://shopify/Product/1");
    expect(admin.createDraftProduct).not.toHaveBeenCalled();
  });

  it("records the external reference after the first successful create", async () => {
    const provider = providerRepository({ reserveProviderOperation: vi.fn().mockImplementation(async (input) => ({ workflowId: input.workflowId, provider: "shopify", operation: "draft_product_create", version: 1, idempotencyKey: input.idempotencyKey, requestHash: input.requestHash, reservationToken: input.reservationToken, status: "reserved", createdAt: "now", updatedAt: "now" })) });
    const admin = { createDraftProduct: vi.fn().mockResolvedValue({ id: "gid://shopify/Product/2", title: workflow.productTitle, handle: "vibe-codes-only", status: "DRAFT", adminUrl: "https://shop.example.com/admin/products/2" }) } satisfies ShopifyAdminClient;
    const result = await createShopifyDraftWithIdempotency(workflow, actor, provider, admin);
    expect(result.reused).toBe(false);
    expect(provider.recordProviderDraftCreated).toHaveBeenCalledWith(expect.objectContaining({ workflowId: "workflow-1", expectedVersion: 1, externalId: "gid://shopify/Product/2" }), actor);
  });

  it("marks an uncertain provider failure for reconciliation", async () => {
    const provider = providerRepository({ reserveProviderOperation: vi.fn().mockImplementation(async (input) => ({ workflowId: input.workflowId, provider: "shopify", operation: "draft_product_create", version: 1, idempotencyKey: input.idempotencyKey, requestHash: input.requestHash, reservationToken: input.reservationToken, status: "reserved", createdAt: "now", updatedAt: "now" })) });
    const admin = { createDraftProduct: vi.fn().mockRejectedValue(new Error("network timeout")) } satisfies ShopifyAdminClient;
    await expect(createShopifyDraftWithIdempotency(workflow, actor, provider, admin)).rejects.toThrow("network timeout");
    expect(provider.recordProviderUnknown).toHaveBeenCalledWith(expect.objectContaining({ workflowId: "workflow-1", expectedVersion: 1, message: "network timeout" }), actor);
  });
});
