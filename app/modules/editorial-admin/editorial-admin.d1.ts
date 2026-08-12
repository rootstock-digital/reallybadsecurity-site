import type { EditorialStatus } from "../editorial/editorial.types";
import {
  assertEditorialEditPermission,
  assertEditorialPermission,
  getEditorialTransitionAction,
} from "./editorial-admin.policy";
import {
  EditorialConflictError,
  type EditorialAdminEntry,
  type EditorialAuditAction,
  type EditorialRepository,
} from "./editorial-admin.types";
import { validateEditorialDraftInput } from "./editorial-admin.validation";

type D1RunResult = Readonly<{ meta?: Readonly<{ changes?: number }> }>;
type D1Statement = Readonly<{
  bind(...values: readonly unknown[]): D1Statement;
  all<T>(): Promise<Readonly<{ results: readonly T[] }>>;
  first<T>(): Promise<T | null>;
  run(): Promise<D1RunResult>;
}>;

export type EditorialD1Database = Readonly<{
  prepare(query: string): D1Statement;
  batch(statements: readonly D1Statement[]): Promise<readonly unknown[]>;
}>;

type EditorialEntryRow = Readonly<{
  id: string;
  version: number;
  status: EditorialStatus;
  title: string;
  slug: string;
  summary: string;
  format: string;
  series: string;
  body_markdown: string;
  seo_title: string;
  seo_description: string;
  canonical_mode: EditorialAdminEntry["canonicalMode"];
  canonical_url: string | null;
  author_subject: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}>;

export function createD1EditorialRepository(database: EditorialD1Database): EditorialRepository {
  return {
    async listEntries() {
      const result = await database.prepare(`
        SELECT id, version, status, title, slug, summary, format, series, body_markdown,
               seo_title, seo_description, canonical_mode, canonical_url, author_subject,
               created_at, updated_at, published_at
        FROM editorial_entries
        ORDER BY updated_at DESC, id ASC
      `).all<EditorialEntryRow>();
      return result.results.map(toEntry);
    },

    async getEntry(id) {
      return getEntry(database, id);
    },

    async createEntry(input, actor) {
      assertEditorialPermission(actor, "created");
      const draft = validateEditorialDraftInput(input);
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      const entry = toEntry({
        id,
        version: 1,
        status: "draft",
        title: draft.title,
        slug: draft.slug,
        summary: draft.summary,
        format: draft.format,
        series: draft.series,
        body_markdown: draft.body,
        seo_title: draft.seoTitle,
        seo_description: draft.seoDescription,
        canonical_mode: draft.canonicalMode,
        canonical_url: draft.canonicalUrl ?? null,
        author_subject: actor.subject,
        created_at: now,
        updated_at: now,
        published_at: null,
      });
      const snapshot = JSON.stringify(entry);

      await database.batch([
        database.prepare(`
          INSERT INTO editorial_entries (
            id, version, status, title, slug, summary, format, series, body_markdown,
            seo_title, seo_description, canonical_mode, canonical_url, author_subject,
            created_at, updated_at, published_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          entry.id, entry.version, entry.status, entry.title, entry.slug, entry.summary,
          entry.format, entry.series, entry.body, entry.seoTitle, entry.seoDescription,
          entry.canonicalMode, entry.canonicalUrl ?? null, entry.authorSubject,
          entry.createdAt, entry.updatedAt, entry.publishedAt ?? null,
        ),
        database.prepare(`
          INSERT INTO editorial_revisions (id, entry_id, entry_version, snapshot_json, created_by_subject, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(crypto.randomUUID(), entry.id, entry.version, snapshot, actor.subject, now),
        auditStatement(database, entry.id, "created", actor.subject, entry.version, now),
      ]);
      return entry;
    },

    async updateEntry(input, actor) {
      const draft = validateEditorialDraftInput(input);
      const existing = await getEntry(database, input.id);
      assertEditorialEditPermission(actor, existing.authorSubject);
      const nextVersion = input.expectedVersion + 1;
      const now = new Date().toISOString();
      const entry = {
        ...existing,
        version: nextVersion,
        title: draft.title,
        slug: draft.slug,
        summary: draft.summary,
        format: draft.format,
        series: draft.series,
        body: draft.body,
        seoTitle: draft.seoTitle,
        seoDescription: draft.seoDescription,
        canonicalMode: draft.canonicalMode,
        canonicalUrl: draft.canonicalUrl,
        updatedAt: now,
      } satisfies EditorialAdminEntry;

      const update = database.prepare(`
        UPDATE editorial_entries
        SET version = ?, title = ?, slug = ?, summary = ?, format = ?, series = ?, body_markdown = ?,
            seo_title = ?, seo_description = ?, canonical_mode = ?, canonical_url = ?, updated_at = ?
        WHERE id = ? AND version = ? AND status IN ('draft', 'published')
      `).bind(
        entry.version, entry.title, entry.slug, entry.summary, entry.format, entry.series, entry.body,
        entry.seoTitle, entry.seoDescription, entry.canonicalMode, entry.canonicalUrl ?? null,
        entry.updatedAt, entry.id, input.expectedVersion,
      );
      const results = await database.batch([
        update,
        database.prepare(`
          INSERT INTO editorial_revisions (id, entry_id, entry_version, snapshot_json, created_by_subject, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(crypto.randomUUID(), entry.id, entry.version, JSON.stringify(entry), actor.subject, now),
        auditStatement(database, entry.id, "updated", actor.subject, entry.version, now),
      ]);
      if ((results[0] as D1RunResult | undefined)?.meta?.changes !== 1) throw new EditorialConflictError();
      return entry;
    },

    async transitionEntry(input, actor) {
      const existing = await getEntry(database, input.id);
      const action = getEditorialTransitionAction(existing.status, input.nextStatus);
      assertEditorialPermission(actor, action);
      const now = new Date().toISOString();
      const publishedAt = input.nextStatus === "published" ? now : existing.publishedAt;
      const update = database.prepare(`
        UPDATE editorial_entries
        SET version = version + 1, status = ?, updated_at = ?, published_at = ?
        WHERE id = ? AND version = ? AND status = ?
      `).bind(input.nextStatus, now, publishedAt ?? null, input.id, input.expectedVersion, existing.status);

      const entry = {
        ...existing,
        version: existing.version + 1,
        status: input.nextStatus,
        updatedAt: now,
        publishedAt,
      };
      const results = await database.batch([
        update,
        database.prepare(`
          INSERT INTO editorial_revisions (id, entry_id, entry_version, snapshot_json, created_by_subject, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(crypto.randomUUID(), entry.id, entry.version, JSON.stringify(entry), actor.subject, now),
        auditStatement(database, entry.id, action, actor.subject, entry.version, now),
      ]);
      if ((results[0] as D1RunResult | undefined)?.meta?.changes !== 1) throw new EditorialConflictError();
      return entry;
    },
  };
}

async function getEntry(database: EditorialD1Database, id: string): Promise<EditorialAdminEntry> {
  const row = await database.prepare(`
    SELECT id, version, status, title, slug, summary, format, series, body_markdown,
           seo_title, seo_description, canonical_mode, canonical_url, author_subject,
           created_at, updated_at, published_at
    FROM editorial_entries WHERE id = ?
  `).bind(id).first<EditorialEntryRow>();
  if (!row) throw new EditorialConflictError("This editorial entry no longer exists.");
  return toEntry(row);
}

function auditStatement(
  database: EditorialD1Database,
  entryId: string,
  action: EditorialAuditAction,
  actorSubject: string,
  entryVersion: number,
  createdAt: string,
): D1Statement {
  return database.prepare(`
    INSERT INTO editorial_audit_events (id, entry_id, action, actor_subject, entry_version, metadata_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(crypto.randomUUID(), entryId, action, actorSubject, entryVersion, "{}", createdAt);
}

function toEntry(row: EditorialEntryRow): EditorialAdminEntry {
  return {
    id: row.id,
    version: row.version,
    status: row.status,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    format: row.format,
    series: row.series,
    body: row.body_markdown,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    canonicalMode: row.canonical_mode,
    canonicalUrl: row.canonical_url ?? undefined,
    authorSubject: row.author_subject,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at ?? undefined,
  };
}
