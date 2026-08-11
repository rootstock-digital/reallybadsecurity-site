import type { ShopifyAdminClient, ShopifyAdminConfig, ShopifyDraftProduct, ShopifyDraftProductPlan } from "./shopify.types";

type GraphqlResponse<T> = Readonly<{
  data?: T;
  errors?: readonly Readonly<{ message?: string }>[];
  extensions?: Readonly<Record<string, unknown>>;
}>;
type ProductCreatePayload = Readonly<{
  product: Readonly<{ id: string; title: string; handle: string; status: string }> | null;
  userErrors: readonly Readonly<{ field?: readonly string[]; message: string }>[];
}>;
type ClientCredentialsResponse = Readonly<{
  access_token?: string;
  expires_in?: number;
}>;

const PRODUCT_CREATE_MUTATION = `#graphql
  mutation GoodsDraftProductCreate($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product { id title handle status }
      userErrors { field message }
    }
  }
`;

export class ShopifyAdminError extends Error {
  constructor(message: string) { super(message); this.name = "ShopifyAdminError"; }
}

export function createShopifyAdminClient(config: ShopifyAdminConfig, fetcher: typeof fetch = fetch): ShopifyAdminClient {
  const apiVersion = config.apiVersion ?? "2026-07";
  const endpoint = `https://${config.storeDomain}/admin/api/${apiVersion}/graphql.json`;
  const tokenEndpoint = `https://${config.storeDomain}/admin/oauth/access_token`;
  let cachedToken: Readonly<{ value: string; expiresAt: number }> | undefined;

  async function getAccessToken() {
    if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) return cachedToken.value;
    const response = await fetcher(tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "client_credentials", client_id: config.clientId, client_secret: config.clientSecret }).toString(),
      cache: "no-store",
    });
    if (!response.ok) throw new ShopifyAdminError("Shopify credentials could not be exchanged.");
    const payload = await response.json() as ClientCredentialsResponse;
    if (!payload.access_token) throw new ShopifyAdminError("Shopify did not return an Admin API token.");
    const expiresIn = typeof payload.expires_in === "number" && payload.expires_in > 0 ? payload.expires_in : 86_400;
    cachedToken = { value: payload.access_token, expiresAt: Date.now() + expiresIn * 1_000 };
    return payload.access_token;
  }

  return {
    async createDraftProduct(plan: ShopifyDraftProductPlan) {
      const accessToken = await getAccessToken();
      const response = await fetcher(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": accessToken },
        body: JSON.stringify({
          query: PRODUCT_CREATE_MUTATION,
          variables: { product: { title: plan.title, vendor: plan.vendor, productType: plan.productType, status: plan.status, tags: plan.tags, descriptionHtml: plan.description } },
        }),
        cache: "no-store",
      });
      if (!response.ok) throw new ShopifyAdminError("Shopify Admin API is unavailable.");
      const payload = await response.json() as GraphqlResponse<{ productCreate: ProductCreatePayload }>;
      const graphQLError = payload.errors?.[0]?.message;
      if (graphQLError) throw new ShopifyAdminError(graphQLError);
      const result = payload.data?.productCreate;
      const userError = result?.userErrors[0]?.message;
      if (!result?.product || userError) throw new ShopifyAdminError(userError ?? "Shopify did not create the draft product.");
      const product = result.product;
      return { id: product.id, title: product.title, handle: product.handle, status: product.status, adminUrl: `https://${config.storeDomain}/admin/products/${product.id.split("/").pop()}` } satisfies ShopifyDraftProduct;
    },
  };
}
