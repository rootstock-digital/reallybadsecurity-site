import type { MetadataRoute } from "next";

import type { EditorialConfig } from "./editorial.config";
import { getPublicEditorialEntries } from "./editorial.loader";
import { getEditorialArticlePath, getEditorialIndexPath } from "./editorial.routes";
import type { EditorialEntry } from "./editorial.types";

export function getEditorialSitemapEntries(
  config: EditorialConfig,
  siteOrigin: string,
  entries: readonly EditorialEntry[] = getPublicEditorialEntries(),
): MetadataRoute.Sitemap {
  const publicEntries = entries.filter(
    (entry) => entry.frontmatter.status === "published",
  );
  const latestModified = getLatestModifiedDate(publicEntries);

  return [
    {
      url: new URL(getEditorialIndexPath(config), siteOrigin).toString(),
      ...(latestModified ? { lastModified: latestModified } : {}),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...publicEntries.map((entry) => ({
      url: new URL(
        getEditorialArticlePath(config, entry.frontmatter.slug),
        siteOrigin,
      ).toString(),
      lastModified: entry.frontmatter.updatedAt ?? entry.frontmatter.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

function getLatestModifiedDate(entries: readonly EditorialEntry[]): string | undefined {
  return entries
    .flatMap((entry) => [entry.frontmatter.updatedAt, entry.frontmatter.publishedAt])
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);
}
