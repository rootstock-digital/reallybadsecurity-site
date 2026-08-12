import type { MetadataRoute } from "next";
import { rbsEditorialConfig, rbsEditorialSchemaOptions, rbsEditorialSite } from "./config/editorial";
import { getRequestPublicEditorialEntries } from "./modules/editorial/editorial.request-loader";
import { getEditorialSitemapEntries } from "./modules/editorial/editorial.sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about", "/contact", "/editorial-standards", "/watch", "/shop", "/join"];
  const editorialEntries = await getRequestPublicEditorialEntries(rbsEditorialSchemaOptions);

  return [
    ...routes.map((route) => ({
      url: `${rbsEditorialSite.origin}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...getEditorialSitemapEntries(rbsEditorialConfig, rbsEditorialSite.origin, editorialEntries),
  ];
}
