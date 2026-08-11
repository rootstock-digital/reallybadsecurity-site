PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS goods_provider_records (
  workflow_id TEXT NOT NULL REFERENCES goods_workflows(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('shopify')),
  operation TEXT NOT NULL CHECK (operation IN ('draft_product_create')),
  version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
  idempotency_key TEXT NOT NULL UNIQUE,
  request_hash TEXT NOT NULL,
  reservation_token TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('reserved', 'draft_created', 'unknown', 'failed')),
  external_id TEXT,
  external_url TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (workflow_id, provider, operation)
);

CREATE INDEX IF NOT EXISTS idx_goods_provider_records_status
  ON goods_provider_records (provider, operation, status, updated_at DESC);
