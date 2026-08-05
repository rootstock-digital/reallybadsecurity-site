export const editorialStatuses = [
  "draft",
  "in_review",
  "scheduled",
  "published",
  "retired",
] as const;

export type EditorialStatus = (typeof editorialStatuses)[number];

export const editorialSeries = [
  "operational-readiness",
  "bad-defaults",
  "human-layer",
  "attack-surface",
  "incident-reality",
  "security-theater",
] as const;

export type EditorialSeries = (typeof editorialSeries)[number];

export const editorialSeriesLabels: Record<EditorialSeries, string> = {
  "operational-readiness": "Operational Readiness",
  "bad-defaults": "Bad Defaults",
  "human-layer": "Human Layer",
  "attack-surface": "Attack Surface",
  "incident-reality": "Incident Reality",
  "security-theater": "Security Theater",
};

export type EditorialAuthor = Readonly<{
  id: string;
  name: string;
}>;

export type EditorialSource = Readonly<{
  title: string;
  url: string;
  publisher?: string;
}>;

export type EditorialImage = Readonly<{
  src: string;
  alt: string;
  decorative: boolean;
}>;

export type EditorialCanonical = Readonly<{
  mode: "local" | "external" | "owner-decision-required";
  url?: string;
}>;

export type EditorialSeo = Readonly<{
  title: string;
  description: string;
  noIndex: boolean;
}>;

export type EditorialFrontmatter = Readonly<{
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: EditorialStatus;
  format: string;
  series: EditorialSeries;
  authors: readonly EditorialAuthor[];
  publishedAt?: string;
  scheduledAt?: string;
  updatedAt?: string;
  image?: EditorialImage;
  relatedIds: readonly string[];
  sources: readonly EditorialSource[];
  disclosures: readonly string[];
  canonical: EditorialCanonical;
  seo: EditorialSeo;
}>;

export type EditorialEntry = Readonly<{
  frontmatter: EditorialFrontmatter;
  body: string;
  filePath: string;
}>;

export type EditorialSchemaOptions = Readonly<{
  factualFormats?: readonly string[];
}>;
