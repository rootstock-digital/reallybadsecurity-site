import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getAccessConfig, getVerifiedEditorialActor } from "../editorial-admin/editorial-admin.access";
import { createD1GoodsRepository, type GoodsD1Database } from "./goods.d1";
import { createD1GoodsProviderRepository } from "./goods-provider.d1";
import { createShopifyAdminClient } from "./shopify.admin";
import type { GoodsAssetBucket } from "./goods-assets";

type GoodsRuntimeEnv = Readonly<{
  EDITORIAL_DB?: GoodsD1Database;
  SHOPIFY_STORE_DOMAIN?: string;
  SHOPIFY_ADMIN_CLIENT_ID?: string;
  SHOPIFY_ADMIN_CLIENT_SECRET?: string;
  EDITORIAL_ACCESS_TEAM_DOMAIN?: string;
  EDITORIAL_ACCESS_AUDIENCE?: string;
  GOODS_ASSETS?: GoodsAssetBucket;
}>;

export async function getGoodsWorkspace(requestHeaders: Headers) {
  const context = await getCloudflareContext({ async: true });
  const env = context.env as GoodsRuntimeEnv;
  const database = env.EDITORIAL_DB;
  if (!database) return null;
  const actor = await getVerifiedEditorialActor(requestHeaders, database, getAccessConfig(env));
  if (!actor) return null;
  const shopifyAdminClient = env.SHOPIFY_STORE_DOMAIN && env.SHOPIFY_ADMIN_CLIENT_ID && env.SHOPIFY_ADMIN_CLIENT_SECRET
    ? createShopifyAdminClient({ storeDomain: env.SHOPIFY_STORE_DOMAIN, clientId: env.SHOPIFY_ADMIN_CLIENT_ID, clientSecret: env.SHOPIFY_ADMIN_CLIENT_SECRET })
    : null;
  return { actor, repository: createD1GoodsRepository(database), providerRepository: createD1GoodsProviderRepository(database), shopifyAdminClient, assetBucket: env.GOODS_ASSETS ?? null };
}
