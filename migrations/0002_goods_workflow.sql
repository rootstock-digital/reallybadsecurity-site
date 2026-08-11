PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS goods_workflows (
  id TEXT PRIMARY KEY,
  version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
  status TEXT NOT NULL CHECK (status IN ('draft', 'in_review', 'approved', 'published', 'retired')),
  design_name TEXT NOT NULL,
  design_code TEXT NOT NULL,
  product_title TEXT NOT NULL,
  format TEXT NOT NULL,
  source_of_truth TEXT NOT NULL CHECK (source_of_truth IN ('shopify', 'client-workflow')),
  created_by_subject TEXT NOT NULL REFERENCES editorial_members(subject),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT
);

CREATE TABLE IF NOT EXISTS goods_workflow_assets (
  id TEXT PRIMARY KEY,
  workflow_id TEXT NOT NULL REFERENCES goods_workflows(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('source_artwork', 'production_artwork', 'product_mockup', 'detail_view', 'lifestyle', 'size_guide', 'provenance')),
  label TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('missing', 'in_progress', 'ready', 'approved')),
  alt_text TEXT,
  source_ref TEXT,
  UNIQUE (workflow_id, kind)
);

CREATE TABLE IF NOT EXISTS goods_workflow_gates (
  id TEXT NOT NULL,
  workflow_id TEXT NOT NULL REFERENCES goods_workflows(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  required INTEGER NOT NULL CHECK (required IN (0, 1)),
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'passed', 'blocked')),
  PRIMARY KEY (workflow_id, id)
);

CREATE TABLE IF NOT EXISTS goods_workflow_audit_events (
  id TEXT PRIMARY KEY,
  workflow_id TEXT NOT NULL REFERENCES goods_workflows(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('created', 'asset_updated', 'gate_updated', 'status_transitioned', 'published', 'retired')),
  actor_subject TEXT NOT NULL REFERENCES editorial_members(subject),
  workflow_version INTEGER NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_goods_workflows_status_updated
  ON goods_workflows (status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_goods_audit_workflow_created
  ON goods_workflow_audit_events (workflow_id, created_at DESC);
