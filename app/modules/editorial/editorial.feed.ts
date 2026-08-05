import type { EditorialConfig } from "./editorial.config";
import { getPublicEditorialEntries } from "./editorial.loader";
import { getEditorialArticlePath, getEditorialIndexPath } from "./editorial.routes";
import type { EditorialEntry } from "./editorial.types";

export function getEditorialRssXml(
  config: EditorialConfig,
  siteOrigin: string,
  siteName: string,
  entries: readonly EditorialEntry[] = getPublicEditorialEntries(),
): string {
  const publicEntries = entries.filter(
    (entry) => entry.frontmatter.status === "published",
  );
  const indexUrl = toAbsoluteUrl(getEditorialIndexPath(config), siteOrigin);
  const lastBuildDate = getLatestDate(publicEntries);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/">',
    "<channel>",
    `<title>${escapeXml(`${siteName} ${config.label}`)}</title>`,
    `<link>${escapeXml(indexUrl)}</link>`,
    `<description>${escapeXml(`${config.label} from ${siteName}.`)}</description>`,
    ...(lastBuildDate ? [`<lastBuildDate>${escapeXml(toRssDate(lastBuildDate))}</lastBuildDate>`] : []),
    ...publicEntries.map((entry) => renderRssItem(entry, config, siteOrigin)),
    "</channel>",
    "</rss>",
  ].join("\n");
}

function renderRssItem(
  entry: EditorialEntry,
  config: EditorialConfig,
  siteOrigin: string,
): string {
  const { frontmatter } = entry;
  const url = toAbsoluteUrl(
    getEditorialArticlePath(config, frontmatter.slug),
    siteOrigin,
  );
  const authors = frontmatter.authors.map((author) =>
    `<dc:creator>${escapeXml(author.name)}</dc:creator>`,
  );

  return [
    "<item>",
    `<title>${escapeXml(frontmatter.title)}</title>`,
    `<link>${escapeXml(url)}</link>`,
    `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
    `<description>${escapeXml(frontmatter.summary)}</description>`,
    `<pubDate>${escapeXml(toRssDate(frontmatter.publishedAt ?? ""))}</pubDate>`,
    ...(frontmatter.updatedAt
      ? [`<dcterms:modified>${escapeXml(frontmatter.updatedAt)}</dcterms:modified>`]
      : []),
    ...authors,
    "</item>",
  ].join("\n");
}

function getLatestDate(entries: readonly EditorialEntry[]): string | undefined {
  return entries
    .flatMap((entry) => [entry.frontmatter.updatedAt, entry.frontmatter.publishedAt])
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);
}

function toAbsoluteUrl(path: string, siteOrigin: string): string {
  return new URL(path, siteOrigin).toString();
}

function toRssDate(value: string): string {
  return new Date(value).toUTCString();
}

export function escapeXml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}
