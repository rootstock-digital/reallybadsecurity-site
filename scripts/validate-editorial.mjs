import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative, resolve, sep } from "node:path";

const statuses = ["draft", "in_review", "scheduled", "published", "retired"];
const checkExternalLinks = process.argv.includes("--check-external-links");
const knownApplicationRouteSegments = new Set([
  "about",
  "api",
  "contact",
  "privacy",
  "services",
  "terms",
]);
const reservedEditorialArticleSlugs = new Set(["page"]);
const defaultSiteOrigin = "https://example.com";
const nonDescriptiveLinkText = new Set(["click here", "here", "read more", "more"]);
const defaultAccessibility = Object.freeze({
  linkTextSeverity: "warning",
  requireMediaCaptions: false,
  requireMediaCredits: false,
});

export function validateEditorialDirectory({
  contentDirectory = resolve(process.cwd(), "content/editorial"),
  configPath = resolve(process.cwd(), "app/config/editorial.ts"),
  publicMediaDirectory = resolve(process.cwd(), "public/media"),
  publicDirectory = resolve(process.cwd(), "public"),
  siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteOrigin,
  allowForwardReferences = false,
  accessibility,
} = {}) {
  const diagnostics = [];
  const config = readEditorialConfig(configPath, diagnostics);
  validateSiteOrigin(siteOrigin, diagnostics);

  const entries = getEditorialFiles(contentDirectory).flatMap((filePath) => {
    const entry = validateEditorialFile(filePath, diagnostics, {
      contentDirectory,
      publicDirectory,
      publicMediaDirectory,
    });
    return entry ? [entry] : [];
  });

  validateCollection(entries, diagnostics, {
    config,
    siteOrigin,
    allowForwardReferences,
    publicDirectory,
    contentDirectory,
    publicMediaDirectory,
    accessibility: accessibility ?? config?.accessibility ?? defaultAccessibility,
  });

  return {
    diagnostics,
    entries,
    summary: getSummary(entries),
  };
}

export function formatEditorialValidationResult(result, cwd = process.cwd()) {
  const lines = [];
  for (const diagnostic of result.diagnostics) {
    const filePath = diagnostic.filePath
      ? relative(cwd, diagnostic.filePath) || diagnostic.filePath
      : "configuration";
    const location = diagnostic.line ? `${filePath}:${diagnostic.line}` : filePath;
    lines.push(`${diagnostic.level.toUpperCase()} ${location} [${diagnostic.field}]: ${diagnostic.reason}`);
  }

  const statusSummary = statuses
    .map((status) => `${status}: ${result.summary.statusCounts[status]}`)
    .join(", ");
  lines.push(
    `Editorial validation checked ${result.summary.totalEntries === 1 ? "1 entry" : `${result.summary.totalEntries} entries`}: ${statusSummary}.`,
  );
  lines.push(
    result.diagnostics.some((diagnostic) => diagnostic.level === "error")
      ? "Editorial validation failed."
      : "Editorial validation passed.",
  );

  return lines.join("\n");
}

function getEditorialFiles(directory) {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = join(directory, entry.name);
      if (entry.isDirectory()) return getEditorialFiles(entryPath);
      return entry.isFile() && /\.mdx?$/.test(entry.name) ? [entryPath] : [];
    })
    .sort();
}

function validateEditorialFile(filePath, diagnostics, directories) {
  const source = readFileSync(filePath, "utf8");
  const document = getEditorialDocument(source, filePath, diagnostics);
  if (!document) return null;

  const value = readJsonFrontmatter(document.frontmatter, filePath, diagnostics);
  if (!value || Array.isArray(value) || typeof value !== "object") {
    addError(diagnostics, filePath, "frontmatter", "must be a JSON object.");
    return null;
  }

  const entry = validateEntry(value, filePath, diagnostics, directories.publicMediaDirectory);
  if (!entry) return null;

  return { ...entry, markdownLinks: validateMarkdownBody(document, filePath, diagnostics) };
}

function getEditorialDocument(source, filePath, diagnostics) {
  if (!source.startsWith("---\n")) {
    addError(diagnostics, filePath, "frontmatter", "must begin with a --- delimiter.");
    return null;
  }
  const closingDelimiter = source.indexOf("\n---\n", 4);
  if (closingDelimiter === -1) {
    addError(diagnostics, filePath, "frontmatter", "is missing its closing --- delimiter.");
    return null;
  }
  const bodyStart = closingDelimiter + "\n---\n".length;
  return {
    frontmatter: source.slice(4, closingDelimiter),
    body: source.slice(bodyStart),
    bodyStartLine: source.slice(0, bodyStart).split("\n").length,
  };
}

function readJsonFrontmatter(frontmatter, filePath, diagnostics) {
  if (!frontmatter.trim().startsWith("{")) {
    addError(
      diagnostics,
      filePath,
      "frontmatter",
      "must use the documented JSON-compatible YAML subset.",
    );
    return null;
  }
  try {
    return JSON.parse(frontmatter);
  } catch {
    addError(diagnostics, filePath, "frontmatter", "is not valid JSON-compatible YAML.");
    return null;
  }
}

function validateEntry(record, filePath, diagnostics, publicMediaDirectory) {
  let valid = true;
  const requiredString = (field) => {
    const value = record[field];
    if (typeof value !== "string" || !value.trim()) {
      addError(diagnostics, filePath, field, "must be a non-empty string.");
      valid = false;
      return "";
    }
    return value.trim();
  };

  const id = requiredString("id");
  const slug = requiredString("slug");
  requiredString("title");
  requiredString("summary");
  const format = requiredString("format");
  const status = requiredString("status");

  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    addError(diagnostics, filePath, "slug", "must be lower-case kebab-case.");
    valid = false;
  }
  if (status && !statuses.includes(status)) {
    addError(diagnostics, filePath, "status", `must be one of ${statuses.join(", ")}.`);
    valid = false;
  }

  const publishedAt = validateOptionalDate(record.publishedAt, "publishedAt", filePath, diagnostics);
  const scheduledAt = validateOptionalDate(record.scheduledAt, "scheduledAt", filePath, diagnostics);
  if ((record.publishedAt != null && !publishedAt) || (record.scheduledAt != null && !scheduledAt)) {
    valid = false;
  }
  const updatedAt = validateOptionalDate(record.updatedAt, "updatedAt", filePath, diagnostics);
  if (record.updatedAt != null && !updatedAt) valid = false;

  const seo = record.seo;
  if (!seo || typeof seo !== "object" || Array.isArray(seo)) {
    addError(diagnostics, filePath, "seo", "must be an object with title, description, and noIndex.");
    valid = false;
  } else {
    if (typeof seo.title !== "string" || !seo.title.trim()) {
      addError(diagnostics, filePath, "seo.title", "must be a non-empty string.");
      valid = false;
    }
    if (typeof seo.description !== "string" || !seo.description.trim()) {
      addError(diagnostics, filePath, "seo.description", "must be a non-empty string.");
      valid = false;
    }
    if (typeof seo.noIndex !== "boolean") {
      addError(diagnostics, filePath, "seo.noIndex", "must be a boolean.");
      valid = false;
    }
  }

  const noIndex = seo?.noIndex;
  if (status === "published" && (!publishedAt || noIndex !== false)) {
    addError(diagnostics, filePath, "status", "published entries require publishedAt and seo.noIndex: false.");
    valid = false;
  }
  if (status === "scheduled" && (!scheduledAt || publishedAt || noIndex !== true)) {
    addError(diagnostics, filePath, "status", "scheduled entries require scheduledAt, no publishedAt, and seo.noIndex: true.");
    valid = false;
  }
  if (["draft", "in_review"].includes(status) && (publishedAt || scheduledAt || noIndex !== true)) {
    addError(diagnostics, filePath, "status", `${status} entries require no publication dates and seo.noIndex: true.`);
    valid = false;
  }
  if (status === "retired" && (!publishedAt || noIndex !== true)) {
    addError(diagnostics, filePath, "status", "retired entries require publishedAt and seo.noIndex: true.");
    valid = false;
  }

  const authors = validateAuthors(record.authors, filePath, diagnostics);
  if (!authors) valid = false;
  const sources = validateSources(record.sources, filePath, diagnostics);
  if (!sources) valid = false;
  if (format === "explainer" && sources?.length === 0) {
    addError(diagnostics, filePath, "sources", "explainer entries require at least one source.");
    valid = false;
  }
  if (!validateStringArray(record.disclosures, "disclosures", filePath, diagnostics)) valid = false;
  const relatedIds = validateRelatedIds(record.relatedIds, filePath, diagnostics);
  if (!relatedIds) valid = false;
  if (!validateCanonical(record.canonical, filePath, diagnostics)) valid = false;
  const image = validateImage(
    record.image,
    filePath,
    diagnostics,
    publicMediaDirectory,
  );
  if (record.image != null && !image) valid = false;
  const media = validateMediaManifest(record.media, filePath, diagnostics);
  if (!media) valid = false;
  const linkTextSuppressions = validateLinkTextSuppressions(record.a11y, filePath, diagnostics);
  if (!linkTextSuppressions) valid = false;

  if (!id || !slug || !statuses.includes(status) || !relatedIds || !media || !linkTextSuppressions) return null;
  return { filePath, id, slug, status, publishedAt, relatedIds, image, media, sources: Array.isArray(record.sources) ? record.sources : [], linkTextSuppressions, valid };
}

function validateMediaManifest(value, filePath, diagnostics) {
  if (value == null) return new Map();
  if (!Array.isArray(value)) {
    addError(diagnostics, filePath, "media", "must be an array of media metadata objects.");
    return null;
  }
  const media = new Map();
  for (const [index, item] of value.entries()) {
    if (!item || typeof item !== "object" || Array.isArray(item) || typeof item.src !== "string" || !item.src.trim()) {
      addError(diagnostics, filePath, `media[${index}]`, "requires a non-empty src.");
      continue;
    }
    const src = item.src.trim();
    if (media.has(src)) {
      addError(diagnostics, filePath, `media[${index}].src`, `duplicates media metadata for "${src}".`);
      continue;
    }
    for (const field of ["caption", "credit"]) {
      if (item[field] != null && (typeof item[field] !== "string" || !item[field].trim())) {
        addError(diagnostics, filePath, `media[${index}].${field}`, "must be meaningful non-empty text when provided.");
      }
    }
    media.set(src, { caption: item.caption?.trim(), credit: item.credit?.trim() });
  }
  return media;
}

function validateLinkTextSuppressions(value, filePath, diagnostics) {
  if (value == null) return new Set();
  if (!value || typeof value !== "object" || Array.isArray(value) || value.allowNonDescriptiveLinkText == null) {
    addError(diagnostics, filePath, "a11y", "must be an object containing allowNonDescriptiveLinkText when provided.");
    return null;
  }
  if (!Array.isArray(value.allowNonDescriptiveLinkText)) {
    addError(diagnostics, filePath, "a11y.allowNonDescriptiveLinkText", "must be an array of exact link labels.");
    return null;
  }
  const labels = new Set();
  for (const [index, label] of value.allowNonDescriptiveLinkText.entries()) {
    if (typeof label !== "string" || !label.trim()) {
      addError(diagnostics, filePath, `a11y.allowNonDescriptiveLinkText[${index}]`, "must be a non-empty exact link label.");
    } else {
      labels.add(normalizeLinkText(label));
    }
  }
  return labels;
}

function validateImage(value, filePath, diagnostics, publicMediaDirectory) {
  if (value == null) return undefined;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    addError(diagnostics, filePath, "image", "must be an object with src, alt, and optional decorative.");
    return null;
  }

  const src = typeof value.src === "string" ? value.src.trim() : "";
  const decorative = value.decorative === true;
  if (value.decorative !== undefined && typeof value.decorative !== "boolean") {
    addError(diagnostics, filePath, "image.decorative", "must be a boolean when provided.");
    return null;
  }
  if (!src) {
    addError(diagnostics, filePath, "image.src", "must be a non-empty path or absolute https URL.");
    return null;
  }
  if (decorative ? value.alt !== "" : typeof value.alt !== "string" || !value.alt.trim()) {
    addError(
      diagnostics,
      filePath,
      "image.alt",
      decorative
        ? "must be an empty string when image.decorative is true."
        : "must be meaningful non-empty text unless image.decorative is explicitly true.",
    );
    return null;
  }

  if (src.startsWith("/")) {
    return validateLocalImage(src, filePath, diagnostics, publicMediaDirectory, decorative);
  }
  if (isSafeHttpsUrl(src)) {
    addWarning(
      diagnostics,
      filePath,
      "image.src",
      `external HTTPS image \"${src}\" skipped without network validation.`,
    );
    return { src, decorative };
  }

  addError(
    diagnostics,
    filePath,
    "image.src",
    `\"${src}\" must be an approved /media/ path or absolute https URL.`,
  );
  return null;
}

function validateLocalImage(src, filePath, diagnostics, publicMediaDirectory, decorative, line) {
  if (
    !src.startsWith("/media/") ||
    src.startsWith("//") ||
    src.startsWith("/\\") ||
    /[\u0000-\u001f\u007f]/.test(src) ||
    src.split("/").includes("..")
  ) {
    addError(
      diagnostics,
      filePath,
      "image.src",
      `\"${src}\" must stay within the approved public/media directory without traversal.`,
      line,
    );
    return null;
  }

  const mediaDirectory = resolve(publicMediaDirectory);
  const localPath = resolve(mediaDirectory, src.slice("/media/".length));
  if (!localPath.startsWith(`${mediaDirectory}${sep}`)) {
    addError(diagnostics, filePath, "image.src", `\"${src}\" resolves outside public/media.`, line);
    return null;
  }
  if (!existsSync(localPath) || !statSync(localPath).isFile()) {
    addError(
      diagnostics,
      filePath,
      "image.src",
      `\"${src}\" does not exist as a local file in public/media. Add the file or use an approved HTTPS URL.`,
      line,
    );
    return null;
  }
  return { src, decorative };
}

function validateAuthors(value, filePath, diagnostics) {
  if (!Array.isArray(value) || value.length === 0) {
    addError(diagnostics, filePath, "authors", "must contain at least one author.");
    return null;
  }
  const authorIds = new Set();
  let valid = true;
  for (const [index, author] of value.entries()) {
    if (!author || typeof author !== "object" || Array.isArray(author)) {
      addError(diagnostics, filePath, `authors[${index}]`, "must be an object.");
      valid = false;
      continue;
    }
    const id = typeof author.id === "string" ? author.id.trim() : "";
    const name = typeof author.name === "string" ? author.name.trim() : "";
    if (!id || !name) {
      addError(diagnostics, filePath, `authors[${index}]`, "requires non-empty id and name.");
      valid = false;
    } else if (authorIds.has(id)) {
      addError(diagnostics, filePath, `authors[${index}].id`, `duplicates author id \"${id}\".`);
      valid = false;
    } else {
      authorIds.add(id);
    }
  }
  return valid ? value : null;
}

function validateSources(value, filePath, diagnostics) {
  if (!Array.isArray(value)) {
    addError(diagnostics, filePath, "sources", "must be an array.");
    return null;
  }
  let valid = true;
  for (const [index, source] of value.entries()) {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      addError(diagnostics, filePath, `sources[${index}]`, "must be an object.");
      valid = false;
      continue;
    }
    if (typeof source.title !== "string" || !source.title.trim()) {
      addError(diagnostics, filePath, `sources[${index}].title`, "must be a non-empty string.");
      valid = false;
    }
    if (!isSafeHttpsUrl(source.url)) {
      addError(diagnostics, filePath, `sources[${index}].url`, "must be an absolute https URL without credentials.");
      valid = false;
    }
  }
  return valid ? value : null;
}

function validateCanonical(value, filePath, diagnostics) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    addError(diagnostics, filePath, "canonical", "must be an object.");
    return false;
  }
  if (!["local", "external", "owner-decision-required"].includes(value.mode)) {
    addError(diagnostics, filePath, "canonical.mode", "must be local, external, or owner-decision-required.");
    return false;
  }
  if (value.url != null && !isSafeHttpsUrl(value.url)) {
    addError(diagnostics, filePath, "canonical.url", "must be an absolute https URL without credentials.");
    return false;
  }
  if (value.mode === "external" && !value.url) {
    addError(diagnostics, filePath, "canonical.url", "is required when canonical.mode is external.");
    return false;
  }
  return true;
}

function validateRelatedIds(value, filePath, diagnostics) {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    addError(diagnostics, filePath, "relatedIds", "must be an array of stable entry IDs.");
    return null;
  }
  const relatedIds = [];
  for (const [index, relatedId] of value.entries()) {
    if (typeof relatedId !== "string" || !relatedId.trim()) {
      addError(diagnostics, filePath, `relatedIds[${index}]`, "must be a non-empty stable entry ID.");
      continue;
    }
    const normalizedId = relatedId.trim();
    if (relatedIds.includes(normalizedId)) {
      addWarning(diagnostics, filePath, `relatedIds[${index}]`, `duplicates \"${normalizedId}\"; the loader will keep the first occurrence.`);
      continue;
    }
    relatedIds.push(normalizedId);
  }
  return relatedIds;
}

function validateStringArray(value, field, filePath, diagnostics) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    addError(diagnostics, filePath, field, "must be an array of strings.");
    return false;
  }
  return true;
}

function validateOptionalDate(value, field, filePath, diagnostics) {
  if (value == null) return undefined;
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) {
    addError(diagnostics, filePath, field, "must be an ISO-parseable date.");
    return null;
  }
  return value;
}

function validateMarkdownBody(document, filePath, diagnostics) {
  const headings = [];
  const links = [];
  let previousLevel = 1;

  for (const [index, line] of document.body.split("\n").entries()) {
    const lineNumber = document.bodyStartLine + index;
    const headingMatch = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const heading = parseHeading(headingMatch[2]);
      if (!heading) {
        addError(diagnostics, filePath, "body.heading", "must include visible heading text.", lineNumber);
      } else {
        if (level === 1) {
          addError(
            diagnostics,
            filePath,
            "body.heading",
            "must not use H1: the frontmatter title is the page H1, so body sections begin at H2.",
            lineNumber,
          );
        }
        if (level > previousLevel + 1) {
          addError(
            diagnostics,
            filePath,
            "body.heading",
            `skips from H${previousLevel} to H${level}; introduce the intermediate heading level.`,
            lineNumber,
          );
        }
        previousLevel = level;
        if (headings.some((candidate) => candidate.anchor === heading.anchor)) {
          addError(diagnostics, filePath, "body.anchor", `duplicates heading anchor "${heading.anchor}".`, lineNumber);
        } else {
          headings.push({ ...heading, line: lineNumber });
        }
      }
    }

    validateUnsupportedMdx(line, filePath, diagnostics, lineNumber);
    collectMarkdownLinks(line, filePath, diagnostics, lineNumber, links);
  }

  const anchors = new Set(headings.map((heading) => heading.anchor));
  return links.map((link) => ({ ...link, anchors }));
}

function parseHeading(value) {
  const explicitAnchor = value.match(/^(.*?)\s+\{#([A-Za-z][A-Za-z0-9_-]*)\}\s*$/);
  const text = (explicitAnchor?.[1] ?? value).trim();
  const anchor = explicitAnchor?.[2] ?? slugifyHeading(text);
  return text && anchor ? { text, anchor } : null;
}

function slugifyHeading(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

function validateUnsupportedMdx(line, filePath, diagnostics, lineNumber) {
  if (/^\s*(?:import|export)\s/.test(line) || /<[A-Za-z][A-Za-z0-9._-]*(?:\s|\/?>)/.test(line)) {
    addError(
      diagnostics,
      filePath,
      "body.mdx",
      "contains executable MDX or HTML. Use the supported structural Markdown subset instead.",
      lineNumber,
    );
    return;
  }
  if (/\{(?!#[A-Za-z][A-Za-z0-9_-]*\})[^}]+\}/.test(line)) {
    addError(
      diagnostics,
      filePath,
      "body.mdx",
      "contains an MDX expression. Expressions are not executed or supported by the local validator.",
      lineNumber,
    );
  }
}

function collectMarkdownLinks(line, filePath, diagnostics, lineNumber, links) {
  const linkPattern = /!?\[([^\]\n]*)\]\(([^\s()]+)\)/g;
  let match;
  let matched = false;
  while ((match = linkPattern.exec(line))) {
    matched = true;
    links.push({
      type: match[0].startsWith("!") ? "image" : "link",
      text: match[1],
      href: match[2],
      line: lineNumber,
    });
  }
  if (line.includes("](") && !matched) {
    addError(
      diagnostics,
      filePath,
      "body.link",
      "uses an unsupported complex Markdown link. Use [label](url) with a simple URL and no title or nested parentheses.",
      lineNumber,
    );
  }
}

function validateMarkdownLink(link, anchors, filePath, diagnostics, directories, accessibility, suppressions) {
  validateLinkText(link, filePath, diagnostics, accessibility, suppressions);
  const href = link.href;
  if (!href || /[\u0000-\u001f\u007f]/.test(href)) {
    addError(diagnostics, filePath, "body.link", `"${href}" is malformed or contains control characters.`, link.line);
    return;
  }
  if (isSafeHttpsUrl(href)) {
    if (!checkExternalLinks) addWarning(diagnostics, filePath, "body.link", `external HTTPS link "${href}" skipped without network validation.`, link.line);
    return;
  }
  if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(href) || href.startsWith("//")) {
    addError(diagnostics, filePath, "body.link", `"${href}" uses an unsafe or unsupported URL scheme.`, link.line);
    return;
  }
  if (href.startsWith("#")) {
    const fragment = href.slice(1);
    if (!fragment || !anchors.has(fragment)) {
      addError(diagnostics, filePath, "body.link", `fragment "${href}" does not match a generated or explicit heading anchor.`, link.line);
    }
    return;
  }
  if (href.startsWith("/")) {
    validateRootRelativeLink(href, link, filePath, diagnostics, directories);
    return;
  }
  validateRelativeLink(href, link, filePath, diagnostics, directories);
}

function validateLinkText(link, filePath, diagnostics, accessibility, suppressions) {
  if (accessibility.linkTextSeverity === "off") return;
  const text = normalizeLinkText(link.text);
  const bareUrl = isSafeHttpUrl(link.text.trim());
  if ((!nonDescriptiveLinkText.has(text) && !bareUrl) || suppressions.has(text)) return;

  const reason = bareUrl
    ? `uses a bare URL as link text. Replace it with a concise description, or add the exact label to a11y.allowNonDescriptiveLinkText after manual review.`
    : `uses non-descriptive link text "${link.text}". Replace it with a concise description, or add the exact label to a11y.allowNonDescriptiveLinkText after manual review.`;
  if (accessibility.linkTextSeverity === "error") {
    addError(diagnostics, filePath, "body.linkText", reason, link.line);
  } else {
    addWarning(diagnostics, filePath, "body.linkText", reason, link.line);
  }
}

function normalizeLinkText(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function validateInlineImage(image, filePath, diagnostics, directories, accessibility, media) {
  const decorative = image.text === "";
  if (!decorative && !image.text.trim()) {
    addError(diagnostics, filePath, "body.image.alt", "must be meaningful non-empty text unless the image is explicitly decorative.", image.line);
    return;
  }
  const src = image.href;
  if (src.startsWith("/")) {
    validateLocalImage(src, filePath, diagnostics, directories.publicMediaDirectory, decorative, image.line);
  } else if (isSafeHttpsUrl(src)) {
    addWarning(diagnostics, filePath, "body.image.src", `external HTTPS image "${src}" skipped without network validation.`, image.line);
  } else {
    addError(diagnostics, filePath, "body.image.src", `"${src}" must be an approved /media/ path or absolute https URL.`, image.line);
  }

  if (!decorative) {
    const metadata = media.get(src);
    if (accessibility.requireMediaCaptions && !metadata?.caption) {
      addError(diagnostics, filePath, "body.image.caption", `requires media metadata with a caption for "${src}" because requireMediaCaptions is enabled.`, image.line);
    }
    if (accessibility.requireMediaCredits && !metadata?.credit) {
      addError(diagnostics, filePath, "body.image.credit", `requires media metadata with a credit for "${src}" because requireMediaCredits is enabled.`, image.line);
    }
  }
}

function validateFrontmatterMediaPolicy(entry, diagnostics, accessibility) {
  if (!entry.image || entry.image.decorative) return;
  const metadata = entry.media.get(entry.image.src);
  if (accessibility.requireMediaCaptions && !metadata?.caption) {
    addError(diagnostics, entry.filePath, "image.caption", `requires media metadata with a caption for "${entry.image.src}" because requireMediaCaptions is enabled.`);
  }
  if (accessibility.requireMediaCredits && !metadata?.credit) {
    addError(diagnostics, entry.filePath, "image.credit", `requires media metadata with a credit for "${entry.image.src}" because requireMediaCredits is enabled.`);
  }
}

function validateRootRelativeLink(href, link, filePath, diagnostics, { publicDirectory, knownPublicRoutes }) {
  const pathname = href.split(/[?#]/, 1)[0];
  if (pathname.startsWith("/\\") || pathname.split("/").includes("..")) {
    addError(diagnostics, filePath, "body.link", `"${href}" must not traverse outside an approved public path.`, link.line);
    return;
  }
  if (knownPublicRoutes?.has(pathname)) return;

  const publicRoot = resolve(publicDirectory);
  const localPath = resolve(publicRoot, pathname.slice(1));
  if (localPath.startsWith(`${publicRoot}${sep}`) && existsSync(localPath) && statSync(localPath).isFile()) return;

  addError(
    diagnostics,
    filePath,
    "body.link",
    `"${href}" does not match a known public route or an existing file in public/.`,
    link.line,
  );
}

function validateRelativeLink(href, link, filePath, diagnostics, { contentDirectory }) {
  if (href.includes("?") || href.includes("#") || href.startsWith("\\") || href.split("/").includes("..")) {
    addError(diagnostics, filePath, "body.link", `"${href}" is not an approved relative content/media link.`, link.line);
    return;
  }
  const contentRoot = resolve(contentDirectory);
  const localPath = resolve(join(filePath, ".."), href);
  if (
    !localPath.startsWith(`${contentRoot}${sep}`) ||
    !/\.mdx?$/.test(localPath) ||
    !existsSync(localPath) ||
    !statSync(localPath).isFile()
  ) {
    addError(
      diagnostics,
      filePath,
      "body.link",
      `"${href}" must resolve to an existing Markdown or MDX file within src/content/editorial.`,
      link.line,
    );
  }
}

function validateCollection(entries, diagnostics, {
  config,
  siteOrigin,
  allowForwardReferences,
  publicDirectory,
  contentDirectory,
  publicMediaDirectory,
  accessibility,
}) {
  const ids = new Map();
  const slugs = new Map();
  for (const entry of entries) {
    if (ids.has(entry.id)) {
      addError(diagnostics, entry.filePath, "id", `duplicates entry id \"${entry.id}\" in ${ids.get(entry.id)}.`);
    } else {
      ids.set(entry.id, entry.filePath);
    }
    if (slugs.has(entry.slug)) {
      addError(diagnostics, entry.filePath, "slug", `duplicates entry slug \"${entry.slug}\" in ${slugs.get(entry.slug)}.`);
    } else {
      slugs.set(entry.slug, entry.filePath);
    }
    if (reservedEditorialArticleSlugs.has(entry.slug)) {
      addError(diagnostics, entry.filePath, "slug", `collides with reserved editorial path \"${entry.slug}\".`);
    }
    if (entry.relatedIds.includes(entry.id)) {
      addError(diagnostics, entry.filePath, "relatedIds", "cannot reference the entry itself.");
    }
    if (config?.segment && entry.slug) {
      try {
        new URL(`/${config.segment}/${entry.slug}`, siteOrigin);
      } catch {
        addError(diagnostics, entry.filePath, "slug", "cannot construct a safe public article URL.");
      }
    }
  }

  const knownPublicRoutes = getKnownPublicRoutes(entries, config);
  for (const entry of entries) {
    for (const link of entry.markdownLinks ?? []) {
      const directories = { contentDirectory, publicDirectory, publicMediaDirectory, knownPublicRoutes };
      if (link.type === "image") {
        validateInlineImage(link, entry.filePath, diagnostics, directories, accessibility, entry.media);
      } else {
        validateMarkdownLink(link, link.anchors, entry.filePath, diagnostics, directories, accessibility, entry.linkTextSuppressions);
      }
    }
    validateFrontmatterMediaPolicy(entry, diagnostics, accessibility);
  }

  for (const entry of entries) {
    for (const relatedId of entry.relatedIds) {
      const target = entries.find((candidate) => candidate.id === relatedId);
      if (!target) {
        const reason = `references unknown entry id \"${relatedId}\".`;
        if (allowForwardReferences) {
          addWarning(diagnostics, entry.filePath, "relatedIds", `${reason} It will not render publicly until a matching published entry exists.`);
        } else {
          addError(diagnostics, entry.filePath, "relatedIds", `${reason} Add the entry or rerun with --allow-forward-references.`);
        }
      } else if (target.status !== "published") {
        addWarning(diagnostics, entry.filePath, "relatedIds", `references ${target.status} entry \"${relatedId}\"; it will not render publicly.`);
      }
    }
  }
}

function getKnownPublicRoutes(entries, config) {
  const routes = new Set(["/", "/about", "/contact", "/privacy", "/services", "/terms"]);
  if (!config?.segment) return routes;
  routes.add(`/${config.segment}`);
  for (const entry of entries) {
    if (entry.status === "published") routes.add(`/${config.segment}/${entry.slug}`);
  }
  return routes;
}

function readEditorialConfig(configPath, diagnostics) {
  if (!existsSync(configPath)) {
    addError(diagnostics, configPath, "segment", "editorial configuration file is missing.");
    return null;
  }
  const source = readFileSync(configPath, "utf8");
  const segment = source.match(/segment:\s*["']([^"']+)["']/)?.[1]?.trim();
  if (!segment) {
    addError(diagnostics, configPath, "segment", "could not read a literal configured segment.");
    return null;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(segment)) {
    addError(diagnostics, configPath, "segment", "must be lower-case kebab-case.");
  }
  if (knownApplicationRouteSegments.has(segment)) {
    addError(diagnostics, configPath, "segment", `conflicts with known application route \"${segment}\".`);
  }
  const configuredSeverity = source.match(/linkTextSeverity:\s*["']([^"']+)["']/)?.[1];
  const linkTextSeverity = configuredSeverity ?? defaultAccessibility.linkTextSeverity;
  if (!(["off", "warning", "error"].includes(linkTextSeverity))) {
    addError(diagnostics, configPath, "accessibility.linkTextSeverity", "must be off, warning, or error.");
  }
  const readBoolean = (field) => source.match(new RegExp(`${field}:\\s*(true|false)`))?.[1] === "true";
  return {
    segment,
    accessibility: {
      linkTextSeverity: ["off", "warning", "error"].includes(linkTextSeverity)
        ? linkTextSeverity
        : defaultAccessibility.linkTextSeverity,
      requireMediaCaptions: readBoolean("requireMediaCaptions"),
      requireMediaCredits: readBoolean("requireMediaCredits"),
    },
  };
}

function validateSiteOrigin(siteOrigin, diagnostics) {
  if (!isSafeHttpUrl(siteOrigin)) {
    addError(diagnostics, null, "siteOrigin", "NEXT_PUBLIC_SITE_URL must be an absolute http(s) URL without credentials.");
  }
}

function isSafeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isSafeHttpUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function getSummary(entries) {
  const statusCounts = Object.fromEntries(statuses.map((status) => [status, 0]));
  for (const entry of entries) statusCounts[entry.status] += 1;
  return { totalEntries: entries.length, statusCounts };
}

function addError(diagnostics, filePath, field, reason, line) {
  diagnostics.push({ level: "error", filePath, field, reason, line });
}

function addWarning(diagnostics, filePath, field, reason, line) {
  diagnostics.push({ level: "warning", filePath, field, reason, line });
}

async function validateExternalLinks(entries, diagnostics) {
  const urls = new Map();
  for (const entry of entries) {
    const add = (url, field) => {
      if (isSafeHttpsUrl(url)) urls.set(url, { filePath: entry.filePath, field });
    };
    for (const link of entry.markdownLinks ?? []) add(link.href, link.type === "image" ? "body.image.src" : "body.link");
    for (const source of entry.sources) add(source.url, "source.url");
    if (entry.image) add(entry.image.src, "image.src");
    for (const src of entry.media.keys()) add(src, "media.src");
  }

  await Promise.all([...urls].map(async ([url, location]) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      let response = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
      if (response.status >= 400) {
        response = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal, headers: { Range: "bytes=0-0" } });
      }
      if (!response.ok) addError(diagnostics, location.filePath, location.field, `external HTTPS URL "${url}" returned HTTP ${response.status}.`);
    } catch (error) {
      const reason = error?.name === "AbortError" ? "timed out" : "could not be reached";
      addWarning(diagnostics, location.filePath, location.field, `external HTTPS URL "${url}" ${reason}; network validation could not complete.`);
    } finally {
      clearTimeout(timeout);
    }
  }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = validateEditorialDirectory({
    allowForwardReferences: process.argv.includes("--allow-forward-references"),
  });
  if (process.argv.includes("--check-external-links")) await validateExternalLinks(result.entries, result.diagnostics);
  console.log(formatEditorialValidationResult(result));
  if (result.diagnostics.some((diagnostic) => diagnostic.level === "error")) {
    process.exitCode = 1;
  }
}
