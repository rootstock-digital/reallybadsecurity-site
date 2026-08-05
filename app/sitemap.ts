import type { MetadataRoute } from "next";
import { rbsEditorialConfig, rbsEditorialSchemaOptions, rbsEditorialSite } from "./config/editorial";
import { getPublicEditorialEntries } from "./modules/editorial/editorial.loader";
import { getEditorialSitemapEntries } from "./modules/editorial/editorial.sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/contact", "/editorial-standards", "/watch", "/shop", "/join"];

  return [
    ...routes.map((route) => ({
      url: `${rbsEditorialSite.origin}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...getEditorialSitemapEntries(rbsEditorialConfig, rbsEditorialSite.origin, getPublicEditorialEntries(undefined, rbsEditorialSchemaOptions)),
  ];
}
