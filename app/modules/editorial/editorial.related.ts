import { getPublicEditorialEntries } from "./editorial.loader";
import type { EditorialEntry } from "./editorial.types";

export const defaultRelatedEditorialLimit = 3;

export function getRelatedEditorialEntries(
  entry: EditorialEntry,
  options: Readonly<{
    limit?: number;
    entries?: readonly EditorialEntry[];
  }> = {},
): EditorialEntry[] {
  if (entry.frontmatter.status !== "published") return [];

  const limit = normalizeLimit(options.limit);
  const publicEntries = (options.entries ?? getPublicEditorialEntries()).filter(
    (candidate) => candidate.frontmatter.status === "published",
  );
  const entriesById = new Map(
    publicEntries.map((candidate) => [candidate.frontmatter.id, candidate]),
  );

  const relatedEntries: EditorialEntry[] = [];
  const seenIds = new Set<string>();
  for (const relatedId of entry.frontmatter.relatedIds) {
    if (seenIds.has(relatedId)) continue;
    seenIds.add(relatedId);

    const relatedEntry = entriesById.get(relatedId);
    if (!relatedEntry || relatedEntry.frontmatter.id === entry.frontmatter.id) {
      continue;
    }

    relatedEntries.push(relatedEntry);
    if (relatedEntries.length === limit) break;
  }

  return relatedEntries;
}

function normalizeLimit(value: number | undefined): number {
  if (value === undefined) return defaultRelatedEditorialLimit;
  if (!Number.isFinite(value) || value < 1) return defaultRelatedEditorialLimit;
  return Math.floor(value);
}
