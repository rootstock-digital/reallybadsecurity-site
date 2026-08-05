import type { Metadata } from "next";

import type { EditorialConfig } from "./editorial.config";
import {
  getPublicEditorialEntries,
  getPublicEditorialEntryBySlug,
} from "./editorial.loader";
import type { EditorialEntry } from "./editorial.types";

export function getEditorialIndexPath(config: EditorialConfig): string {
  return `/${config.segment}`;
}

export function getEditorialArticlePath(
  config: EditorialConfig,
  slug: string,
): string {
  return `${getEditorialIndexPath(config)}/${slug}`;
}

export function getPublicEntryBySlug(slug: string): EditorialEntry | null {
  return getPublicEditorialEntryBySlug(slug);
}

export function getEditorialStaticParams(config: EditorialConfig): Array<{
  editorialSegment: string;
  slug: string;
}> {
  return getPublicEditorialEntries().map((entry) => ({
    editorialSegment: config.segment,
    slug: entry.frontmatter.slug,
  }));
}

export function getEditorialArticleMetadata(
  entry: EditorialEntry,
  config: EditorialConfig,
  siteOrigin: string,
): Metadata {
  if (entry.frontmatter.status !== "published") {
    throw new Error("Editorial metadata is available only for published entries.");
  }

  const path = getEditorialArticlePath(config, entry.frontmatter.slug);
  const canonicalUrl = new URL(path, siteOrigin).toString();

  return {
    title: entry.frontmatter.seo.title,
    description: entry.frontmatter.seo.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: entry.frontmatter.seo.title,
      description: entry.frontmatter.seo.description,
      publishedTime: entry.frontmatter.publishedAt,
      modifiedTime: entry.frontmatter.updatedAt,
      authors: entry.frontmatter.authors.map((author) => author.name),
    },
    robots: { index: true, follow: true },
  };
}
