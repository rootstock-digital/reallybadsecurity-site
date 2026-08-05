import { rbsEditorialConfig, rbsEditorialSchemaOptions, rbsEditorialSite } from "../config/editorial";
import { getEditorialRssXml } from "../modules/editorial/editorial.feed";
import { getPublicEditorialEntries } from "../modules/editorial/editorial.loader";

export function GET() {
  return new Response(getEditorialRssXml(rbsEditorialConfig, rbsEditorialSite.origin, "Really Bad Security", getPublicEditorialEntries(undefined, rbsEditorialSchemaOptions)), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
