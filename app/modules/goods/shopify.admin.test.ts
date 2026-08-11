import { describe, expect, it, vi } from "vitest";

import { createShopifyAdminClient, ShopifyAdminError } from "./shopify.admin";

const plan = { workflowId: "workflow-1", title: "Test product", vendor: "Really Bad Security", productType: "Tee", status: "DRAFT" as const, tags: ["goods-workflow:workflow-1"], description: "Test draft" };

describe("Shopify Admin draft client", () => {
  it("exchanges client credentials and creates a draft with the Admin GraphQL endpoint", async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "temporary-token", expires_in: 86400 }), { status: 200, headers: { "Content-Type": "application/json" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { productCreate: { product: { id: "gid://shopify/Product/123", title: "Test product", handle: "test-product", status: "DRAFT" }, userErrors: [] } } }), { status: 200, headers: { "Content-Type": "application/json" } }));
    const client = createShopifyAdminClient({ storeDomain: "shop.example.com", clientId: "client-id", clientSecret: "secret-value" }, fetcher);
    const result = await client.createDraftProduct(plan);
    expect(result.adminUrl).toBe("https://shop.example.com/admin/products/123");
    expect(fetcher).toHaveBeenNthCalledWith(1, "https://shop.example.com/admin/oauth/access_token", expect.objectContaining({ method: "POST", body: expect.stringContaining("client_id=client-id") }));
    expect(fetcher).toHaveBeenNthCalledWith(2, expect.stringContaining("/admin/api/2026-07/graphql.json"), expect.objectContaining({ headers: expect.objectContaining({ "X-Shopify-Access-Token": "temporary-token" }) }));
  });

  it("surfaces Shopify user errors without exposing request credentials", async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "temporary-token", expires_in: 86400 }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { productCreate: { product: null, userErrors: [{ message: "Product title is invalid" }] } } }), { status: 200 }));
    const client = createShopifyAdminClient({ storeDomain: "shop.example.com", clientId: "client-id", clientSecret: "secret-value" }, fetcher);
    await expect(client.createDraftProduct(plan)).rejects.toThrow(new ShopifyAdminError("Product title is invalid"));
    await expect(client.createDraftProduct(plan)).rejects.not.toThrow("secret-value");
  });
});
