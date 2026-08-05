import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getAccessConfig, getVerifiedEditorialActor } from "./editorial-admin.access";
import { createD1EditorialRepository, type EditorialD1Database } from "./editorial-admin.d1";

declare global {
  interface CloudflareEnv {
    EDITORIAL_DB?: EditorialD1Database;
    EDITORIAL_ACCESS_AUDIENCE?: string;
    EDITORIAL_ACCESS_TEAM_DOMAIN?: string;
  }
}

export async function getEditorialWorkspace(requestHeaders: Headers) {
  const context = await getCloudflareContext({ async: true });
  const database = context.env.EDITORIAL_DB;
  if (!database) return null;
  const actor = await getVerifiedEditorialActor(requestHeaders, database, getAccessConfig(context.env));
  if (!actor) return null;
  return { actor, repository: createD1EditorialRepository(database) };
}
