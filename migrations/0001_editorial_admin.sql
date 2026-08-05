-- Rootstock Editorial Admin: Cloudflare D1 schema.
-- Apply only after creating and binding the RBS editorial D1 database.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS editorial_members (
  subject TEXT PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('writer', 'reviewer', 'publisher', 'admin')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS editorial_entries (
  id TEXT PRIMARY KEY,
  version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
  status TEXT NOT NULL CHECK (status IN ('draft', 'in_review', 'scheduled', 'published', 'retired')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL COLLATE NOCASE UNIQUE,
  summary TEXT NOT NULL,
  format TEXT NOT NULL,
  series TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  canonical_mode TEXT NOT NULL CHECK (canonical_mode IN ('local', 'external', 'owner-decision-required')),
  canonical_url TEXT,
  author_subject TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT,
  FOREIGN KEY (author_subject) REFERENCES editorial_members(subject)
);

CREATE INDEX IF NOT EXISTS idx_editorial_entries_status_updated
  ON editorial_entries(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_editorial_entries_author_updated
  ON editorial_entries(author_subject, updated_at DESC);

CREATE TABLE IF NOT EXISTS editorial_revisions (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL,
  entry_version INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  created_by_subject TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (entry_id) REFERENCES editorial_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by_subject) REFERENCES editorial_members(subject)
);
CREATE INDEX IF NOT EXISTS idx_editorial_revisions_entry_version
  ON editorial_revisions(entry_id, entry_version DESC);

CREATE TABLE IF NOT EXISTS editorial_audit_events (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'returned_to_draft', 'submitted_for_review', 'approved', 'published', 'retired')),
  actor_subject TEXT NOT NULL,
  entry_version INTEGER NOT NULL,
  metadata_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (entry_id) REFERENCES editorial_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_subject) REFERENCES editorial_members(subject)
);
CREATE INDEX IF NOT EXISTS idx_editorial_audit_entry_created
  ON editorial_audit_events(entry_id, created_at DESC);

CREATE TABLE IF NOT EXISTS editorial_distribution_records (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL,
  destination TEXT NOT NULL CHECK (destination IN ('medium')),
  status TEXT NOT NULL CHECK (status IN ('not_started', 'draft_created', 'published', 'failed')),
  external_id TEXT,
  external_url TEXT,
  requested_by_subject TEXT NOT NULL,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(entry_id, destination),
  FOREIGN KEY (entry_id) REFERENCES editorial_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (requested_by_subject) REFERENCES editorial_members(subject)
);
