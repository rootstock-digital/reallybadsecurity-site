import { getCloudflareContext } from "@opennextjs/cloudflare";

import { rbsEditorialSite } from "../../config/editorial";
import type { EditorialD1Database } from "../editorial-admin/editorial-admin.d1";
import type { EditorialEntry, EditorialSchemaOptions } from "./editorial.types";
import { getPublicEditorialEntries } from "./editorial.loader";

type PublishedEditorialRow = Readonly<{
  id: string;
  title: string;
  slug: string;
  summary: string;
  format: string;
  series: string;
  body_markdown: string;
  seo_title: string;
  seo_description: string;
  canonical_mode: "local" | "external" | "owner-decision-required";
  canonical_url: string | null;
  updated_at: string;
  published_at: string | null;
}>;

const publishedColumns = `
  id, title, slug, summary, format, series, body_markdown, seo_title, seo_description,
  canonical_mode, canonical_url, updated_at, published_at
`;

/**
 * Reads only published entries at request time when the site has an editorial D1 binding.
 * Without that binding (including current production), the existing file-backed publishing
 * source remains the fallback.
 */
export async function getRequestPublicEditorialEntries(
  options: EditorialSchemaOptions = {},
): Promise<EditorialEntry[]> {
  const staticEntries = getPublicEditorialEntries(undefined, options);
  const databaseEntries = await getPublishedD1Entries();
  if (!databaseEntries) return staticEntries;

  const entriesBySlug = new Map(staticEntries.map((entry) => [entry.frontmatter.slug, entry]));
  for (const entry of databaseEntries) entriesBySlug.set(entry.frontmatter.slug, entry);

  return [...entriesBySlug.values()].sort((left, right) => {
    const leftDate = left.frontmatter.publishedAt ?? left.frontmatter.updatedAt ?? "";
    const rightDate = right.frontmatter.publishedAt ?? right.frontmatter.updatedAt ?? "";
    return rightDate.localeCompare(leftDate);
  });
}

export async function getRequestPublicEditorialEntryBySlug(
  slug: string,
  options: EditorialSchemaOptions = {},
): Promise<EditorialEntry | null> {
  return (await getRequestPublicEditorialEntries(options)).find(
    (entry) => entry.frontmatter.slug === slug,
  ) ?? null;
}

async function getPublishedD1Entries(): Promise<EditorialEntry[] | null> {
  try {
    const context = await getCloudflareContext({ async: true });
    const database = context.env.EDITORIAL_DB as EditorialD1Database | undefined;
    if (!database) return null;
    const result = await database.prepare(`
      SELECT ${publishedColumns}
      FROM editorial_entries
      WHERE status = 'published'
      ORDER BY published_at DESC, updated_at DESC, id ASC
    `).all<PublishedEditorialRow>();
    return result.results.map(toPublishedEntry);
  } catch {
    return null;
  }
}

function toPublishedEntry(row: PublishedEditorialRow): EditorialEntry {
  return {
    frontmatter: {
      id: row.id,
      title: row.title,
      slug: row.slug,
      summary: row.summary,
      status: "published",
      format: row.format,
      series: row.series as EditorialEntry["frontmatter"]["series"],
      authors: [rbsEditorialSite.author],
      publishedAt: row.published_at ?? row.updated_at,
      updatedAt: row.updated_at,
      relatedIds: [],
      sources: [],
      disclosures: [],
      canonical: { mode: row.canonical_mode, url: row.canonical_url ?? undefined },
      seo: { title: row.seo_title, description: row.seo_description, noIndex: false },
    },
    body: row.body_markdown,
    filePath: `d1:${row.id}`,
  };
}
