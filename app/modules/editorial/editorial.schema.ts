import {
  editorialSeries,
  editorialStatuses,
  type EditorialEntry,
  type EditorialFrontmatter,
  type EditorialSchemaOptions,
} from "./editorial.types";

const defaultFactualFormats = ["explainer"] as const;
const safeSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseEditorialDocument(
  source: string,
  filePath: string,
  options: EditorialSchemaOptions = {},
): EditorialEntry {
  const { frontmatter, body } = splitFrontmatter(source, filePath);
  const parsed = parseFrontmatter(frontmatter, filePath);

  return {
    frontmatter: validateEditorialFrontmatter(parsed, filePath, options),
    body,
    filePath,
  };
}

export function validateEditorialCollection(
  entries: readonly EditorialEntry[],
): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const entry of entries) {
    const { id, slug } = entry.frontmatter;
    if (ids.has(id)) {
      throw new Error(`Duplicate editorial id \"${id}\".`);
    }
    if (slugs.has(slug)) {
      throw new Error(`Duplicate editorial slug \"${slug}\".`);
    }

    ids.add(id);
    slugs.add(slug);
  }

  for (const entry of entries) {
    if (entry.frontmatter.relatedIds.includes(entry.frontmatter.id)) {
      throw new Error(
        `Editorial entry \"${entry.frontmatter.id}\" cannot reference itself as related content.`,
      );
    }
  }
}

function splitFrontmatter(source: string, filePath: string) {
  if (!source.startsWith("---\n")) {
    throw new Error(`${filePath}: editorial content must begin with frontmatter.`);
  }

  const closingDelimiter = source.indexOf("\n---\n", 4);
  if (closingDelimiter === -1) {
    throw new Error(`${filePath}: editorial frontmatter is missing its closing delimiter.`);
  }

  return {
    frontmatter: source.slice(4, closingDelimiter),
    body: source.slice(closingDelimiter + 5).trim(),
  };
}

function parseFrontmatter(value: string, filePath: string): unknown {
  const trimmedValue = value.trim();
  if (!trimmedValue.startsWith("{")) {
    throw new Error(
      `${filePath}: frontmatter must use JSON-compatible YAML in Phase 1.`,
    );
  }

  try {
    return JSON.parse(trimmedValue);
  } catch {
    throw new Error(`${filePath}: editorial frontmatter is not valid JSON-compatible YAML.`);
  }
}

function validateEditorialFrontmatter(
  value: unknown,
  filePath: string,
  options: EditorialSchemaOptions,
): EditorialFrontmatter {
  const record = asRecord(value, filePath, "frontmatter");
  const status = requiredEnum(record.status, filePath, "status", editorialStatuses);
  const seo = validateSeo(record.seo, filePath);
  const factualFormats = options.factualFormats ?? defaultFactualFormats;
  const sources = requiredSources(record.sources, filePath);

  validateStatusConsistency(record, status, seo.noIndex, filePath);
  if (factualFormats.includes(requiredString(record.format, filePath, "format")) && sources.length === 0) {
    throw new Error(`${filePath}: format requires at least one source.`);
  }

  return {
    id: requiredString(record.id, filePath, "id"),
    title: requiredString(record.title, filePath, "title"),
    slug: requiredSlug(record.slug, filePath),
    summary: requiredString(record.summary, filePath, "summary"),
    status,
    format: requiredString(record.format, filePath, "format"),
    series: requiredEnum(record.series, filePath, "series", editorialSeries),
    authors: requiredAuthors(record.authors, filePath),
    publishedAt: optionalDate(record.publishedAt, filePath, "publishedAt"),
    scheduledAt: optionalDate(record.scheduledAt, filePath, "scheduledAt"),
    updatedAt: optionalDate(record.updatedAt, filePath, "updatedAt"),
    image: optionalImage(record.image, filePath),
    relatedIds: normalizeRelatedIds(record.relatedIds, filePath),
    sources,
    disclosures: requiredStringArray(record.disclosures, filePath, "disclosures"),
    canonical: validateCanonical(record.canonical, filePath),
    seo,
  };
}

function normalizeRelatedIds(value: unknown, filePath: string): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new Error(`${filePath}: relatedIds must be an array of stable entry IDs.`);
  }

  const relatedIds: string[] = [];
  for (const relatedId of value) {
    const normalizedId = requiredString(relatedId, filePath, "relatedIds");
    if (!relatedIds.includes(normalizedId)) relatedIds.push(normalizedId);
  }

  return relatedIds;
}

function optionalImage(value: unknown, filePath: string) {
  if (value === undefined || value === null) return undefined;
  const image = asRecord(value, filePath, "image");
  const src = requiredString(image.src, filePath, "image.src");

  if (!isSafePublicImageSource(src)) {
    throw new Error(`${filePath}: image.src must be a root-relative path or absolute https URL.`);
  }

  if (image.decorative !== undefined && typeof image.decorative !== "boolean") {
    throw new Error(`${filePath}: image.decorative must be a boolean when provided.`);
  }
  const decorative = image.decorative === true;
  const alt = typeof image.alt === "string" ? image.alt : undefined;

  if (decorative && alt !== "") {
    throw new Error(`${filePath}: decorative images require image.alt to be an empty string.`);
  }
  if (!decorative && (typeof alt !== "string" || !alt.trim())) {
    throw new Error(`${filePath}: non-decorative images require meaningful non-empty image.alt text.`);
  }

  return {
    src,
    alt: decorative ? "" : alt?.trim() ?? "",
    decorative,
  };
}

function validateStatusConsistency(
  record: Record<string, unknown>,
  status: EditorialFrontmatter["status"],
  noIndex: boolean,
  filePath: string,
): void {
  const hasPublishedAt = record.publishedAt !== undefined && record.publishedAt !== null;
  const hasScheduledAt = record.scheduledAt !== undefined && record.scheduledAt !== null;

  if (status === "published" && (!hasPublishedAt || noIndex)) {
    throw new Error(`${filePath}: published content requires publishedAt and seo.noIndex: false.`);
  }
  if (status === "scheduled" && (!hasScheduledAt || hasPublishedAt || !noIndex)) {
    throw new Error(`${filePath}: scheduled content requires scheduledAt, no publishedAt, and seo.noIndex: true.`);
  }
  if ((status === "draft" || status === "in_review") && (hasPublishedAt || hasScheduledAt || !noIndex)) {
    throw new Error(`${filePath}: ${status} content requires no publication dates and seo.noIndex: true.`);
  }
  if (status === "retired" && (!hasPublishedAt || !noIndex)) {
    throw new Error(`${filePath}: retired content requires publishedAt and seo.noIndex: true.`);
  }
}

function validateSeo(value: unknown, filePath: string) {
  const seo = asRecord(value, filePath, "seo");
  if (typeof seo.noIndex !== "boolean") {
    throw new Error(`${filePath}: seo.noIndex must be a boolean.`);
  }

  return {
    title: requiredString(seo.title, filePath, "seo.title"),
    description: requiredString(seo.description, filePath, "seo.description"),
    noIndex: seo.noIndex,
  };
}

function validateCanonical(value: unknown, filePath: string) {
  const canonical = asRecord(value, filePath, "canonical");
  const mode = requiredEnum(
    canonical.mode,
    filePath,
    "canonical.mode",
    ["local", "external", "owner-decision-required"] as const,
  );
  const url = optionalSafeExternalUrl(canonical.url, filePath, "canonical.url");

  if (mode === "external" && !url) {
    throw new Error(`${filePath}: external canonical mode requires canonical.url.`);
  }

  return url ? { mode, url } : { mode };
}

function requiredSources(value: unknown, filePath: string) {
  if (!Array.isArray(value)) {
    throw new Error(`${filePath}: sources must be an array.`);
  }

  return value.map((source, index) => {
    const record = asRecord(source, filePath, `sources[${index}]`);
    const publisher = optionalString(record.publisher, filePath, `sources[${index}].publisher`);
    const normalized = {
      title: requiredString(record.title, filePath, `sources[${index}].title`),
      url: requiredSafeExternalUrl(record.url, filePath, `sources[${index}].url`),
    };

    return publisher ? { ...normalized, publisher } : normalized;
  });
}

function requiredAuthors(value: unknown, filePath: string) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${filePath}: authors must contain at least one author.`);
  }

  const authorIds = new Set<string>();
  return value.map((author, index) => {
    const record = asRecord(author, filePath, `authors[${index}]`);
    const id = requiredString(record.id, filePath, `authors[${index}].id`);
    if (authorIds.has(id)) {
      throw new Error(`${filePath}: authors must not repeat author id \"${id}\".`);
    }
    authorIds.add(id);
    return {
      id,
      name: requiredString(record.name, filePath, `authors[${index}].name`),
    };
  });
}

function requiredStringArray(value: unknown, filePath: string, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${filePath}: ${field} must be an array of strings.`);
  }

  return value.map((item) => requiredString(item, filePath, field));
}

function requiredSlug(value: unknown, filePath: string): string {
  const slug = requiredString(value, filePath, "slug");
  if (!safeSlugPattern.test(slug)) {
    throw new Error(`${filePath}: slug must be lower-case kebab-case.`);
  }
  return slug;
}

function optionalDate(value: unknown, filePath: string, field: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  const date = requiredString(value, filePath, field);
  if (!Number.isFinite(Date.parse(date))) {
    throw new Error(`${filePath}: ${field} must be an ISO-parseable date.`);
  }
  return date;
}

function requiredSafeExternalUrl(value: unknown, filePath: string, field: string): string {
  const url = requiredString(value, filePath, field);
  if (!isSafeExternalUrl(url)) {
    throw new Error(`${filePath}: ${field} must use an absolute https URL.`);
  }
  return url;
}

function optionalSafeExternalUrl(value: unknown, filePath: string, field: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  return requiredSafeExternalUrl(value, filePath, field);
}

function isSafeExternalUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isSafePublicImageSource(value: string): boolean {
  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\") &&
    !/[\u0000-\u001f\u007f]/.test(value)
  ) {
    return true;
  }

  return isSafeExternalUrl(value);
}

function requiredEnum<T extends readonly string[]>(
  value: unknown,
  filePath: string,
  field: string,
  values: T,
): T[number] {
  if (typeof value !== "string" || !values.includes(value)) {
    throw new Error(`${filePath}: ${field} must be one of ${values.join(", ")}.`);
  }
  return value as T[number];
}

function requiredString(value: unknown, filePath: string, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${filePath}: ${field} must be a non-empty string.`);
  }
  return value.trim();
}

function optionalString(value: unknown, filePath: string, field: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  return requiredString(value, filePath, field);
}

function asRecord(value: unknown, filePath: string, field: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${filePath}: ${field} must be an object.`);
  }
  return value as Record<string, unknown>;
}
