import type { EditorialConfig } from "./editorial.config";
import { getEditorialArticlePath } from "./editorial.routes";
import type { EditorialEntry } from "./editorial.types";

type EditorialPublisher = Readonly<{
  name: string;
  url: string;
}>;

export function getEditorialArticleStructuredData(
  entry: EditorialEntry,
  config: EditorialConfig,
  siteOrigin: string,
  publisher: EditorialPublisher,
): Record<string, unknown> | null {
  if (entry.frontmatter.status !== "published") return null;

  const url = new URL(
    getEditorialArticlePath(config, entry.frontmatter.slug),
    siteOrigin,
  ).toString();
  const image = getPublicImageUrl(entry.frontmatter.image?.src, siteOrigin);

  return {
    "@context": "https://schema.org",
    "@type": getArticleType(entry.frontmatter.format),
    headline: entry.frontmatter.title,
    description: entry.frontmatter.summary,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: entry.frontmatter.publishedAt,
    ...(entry.frontmatter.updatedAt
      ? { dateModified: entry.frontmatter.updatedAt }
      : {}),
    ...(entry.frontmatter.authors.length > 0
      ? {
          author: entry.frontmatter.authors.map((author) => ({
            "@type": "Person",
            name: author.name,
          })),
        }
      : {}),
    publisher: {
      "@type": "Organization",
      name: publisher.name,
      url: publisher.url,
    },
    ...(image ? { image } : {}),
  };
}

function getArticleType(format: string): "Article" | "NewsArticle" {
  return format === "news" ? "NewsArticle" : "Article";
}

function getPublicImageUrl(
  imageSource: string | undefined,
  siteOrigin: string,
): string | undefined {
  if (!imageSource) return undefined;

  if (
    imageSource.startsWith("/") &&
    !imageSource.startsWith("//") &&
    !imageSource.startsWith("/\\") &&
    !/[\u0000-\u001f\u007f]/.test(imageSource)
  ) {
    return new URL(imageSource, siteOrigin).toString();
  }

  try {
    const url = new URL(imageSource);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}
