import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import {
  parseEditorialDocument,
  validateEditorialCollection,
} from "./editorial.schema";
import { bundledEditorialEntries } from "./editorial.bundled";
import type { EditorialEntry, EditorialSchemaOptions } from "./editorial.types";

export const defaultEditorialContentDirectory = resolve(
  process.cwd(),
  "content/editorial",
);

export function getAllEditorialEntries(
  directory = defaultEditorialContentDirectory,
  options: EditorialSchemaOptions = {},
): EditorialEntry[] {
  if (!existsSync(directory)) return [...bundledEditorialEntries];

  const entries = getEditorialFiles(directory).map((filePath) =>
    parseEditorialDocument(readFileSync(filePath, "utf8"), filePath, options),
  );

  validateEditorialCollection(entries);
  return entries;
}

export function getPublicEditorialEntries(
  directory = defaultEditorialContentDirectory,
  options: EditorialSchemaOptions = {},
): EditorialEntry[] {
  return getAllEditorialEntries(directory, options).filter(
    (entry) => entry.frontmatter.status === "published" && !isInternalEditorialFixture(entry),
  );
}

function isInternalEditorialFixture(entry: EditorialEntry): boolean {
  return entry.frontmatter.id === "rbs-note-0001";
}

export function getPublicEditorialEntryBySlug(
  slug: string,
  directory = defaultEditorialContentDirectory,
  options: EditorialSchemaOptions = {},
): EditorialEntry | null {
  return (
    getPublicEditorialEntries(directory, options).find(
      (entry) => entry.frontmatter.slug === slug,
    ) ?? null
  );
}

export function isEditorialPreviewEnabled(
  environment: Readonly<{
    nodeEnv?: string;
    previewFlag?: string;
  }> = {},
): boolean {
  const nodeEnv = environment.nodeEnv ?? process.env.NODE_ENV;
  const previewFlag = environment.previewFlag ?? process.env.EDITORIAL_PREVIEW;

  return nodeEnv !== "production" && previewFlag === "true";
}

function getEditorialFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = join(directory, entry.name);
      if (entry.isDirectory()) return getEditorialFiles(entryPath);
      return entry.isFile() && isEditorialFile(entry.name) ? [entryPath] : [];
    })
    .sort();
}

function isEditorialFile(fileName: string): boolean {
  return fileName.endsWith(".md") || fileName.endsWith(".mdx");
}
