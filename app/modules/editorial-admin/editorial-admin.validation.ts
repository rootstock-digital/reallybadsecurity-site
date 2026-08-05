import { EditorialValidationError, type EditorialDraftInput } from "./editorial-admin.types";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const maxBodyLength = 100_000;

export function validateEditorialDraftInput(input: EditorialDraftInput): EditorialDraftInput {
  const normalized = {
    ...input,
    title: required(input.title, "Title"),
    slug: required(input.slug, "Slug"),
    summary: required(input.summary, "Summary"),
    format: required(input.format, "Format"),
    series: required(input.series, "Series"),
    body: required(input.body, "Article body"),
    seoTitle: required(input.seoTitle, "SEO title"),
    seoDescription: required(input.seoDescription, "SEO description"),
    canonicalUrl: input.canonicalUrl?.trim() || undefined,
  };

  if (!slugPattern.test(normalized.slug)) {
    throw new EditorialValidationError("Slug must use lower-case kebab-case.");
  }
  if (normalized.body.length > maxBodyLength) {
    throw new EditorialValidationError(`Article body must be ${maxBodyLength.toLocaleString()} characters or fewer.`);
  }
  if (/^#\s+/m.test(normalized.body)) {
    throw new EditorialValidationError("Article body must begin with H2 sections; the page renders the article title as its H1.");
  }
  if (/<[A-Za-z][^>]*>/u.test(normalized.body) || /(^|\n)\s*(import|export)\s/m.test(normalized.body)) {
    throw new EditorialValidationError("Article bodies support Markdown only; HTML, MDX imports, and executable content are not allowed.");
  }
  if (normalized.canonicalMode === "external" && !isHttpsUrl(normalized.canonicalUrl)) {
    throw new EditorialValidationError("An external canonical requires an absolute HTTPS URL.");
  }
  if (normalized.canonicalUrl && !isHttpsUrl(normalized.canonicalUrl)) {
    throw new EditorialValidationError("Canonical URLs must use HTTPS.");
  }

  return normalized;
}

function required(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) throw new EditorialValidationError(`${label} is required.`);
  return normalized;
}

function isHttpsUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
