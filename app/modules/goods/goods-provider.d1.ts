import { assertGoodsWritePermission } from "./goods.policy";
import { GoodsProviderConflictError, type GoodsProviderRecord, type GoodsProviderRepository } from "./goods-provider.types";
import type { GoodsD1Database } from "./goods.d1";

type ProviderRow = Readonly<{
  workflow_id: string; provider: "shopify"; operation: "draft_product_create"; version: number; idempotency_key: string;
  request_hash: string; reservation_token: string; status: GoodsProviderRecord["status"];
  external_id: string | null; external_url: string | null; last_error: string | null; created_at: string; updated_at: string;
}>;

export function createD1GoodsProviderRepository(database: GoodsD1Database): GoodsProviderRepository {
  return {
    async getProviderRecord(workflowId, provider, operation) {
      const row = await database.prepare(`SELECT workflow_id, provider, operation, version, idempotency_key, request_hash, reservation_token, status, external_id, external_url, last_error, created_at, updated_at FROM goods_provider_records WHERE workflow_id = ? AND provider = ? AND operation = ?`).bind(workflowId, provider, operation).first<ProviderRow>();
      return row ? toProviderRecord(row) : null;
    },

    async reserveProviderOperation(input, actor) {
      assertGoodsWritePermission(actor);
      const existing = await this.getProviderRecord(input.workflowId, "shopify", "draft_product_create");
      if (existing?.status === "draft_created") return existing;
      if (existing?.status === "unknown") throw new GoodsProviderConflictError("The previous Shopify request may have succeeded. Reconcile it before retrying.");
      if (existing?.status === "reserved" && existing.reservationToken !== input.reservationToken) throw new GoodsProviderConflictError();
      const now = new Date().toISOString();
      await database.prepare(`INSERT OR IGNORE INTO goods_provider_records (workflow_id, provider, operation, version, idempotency_key, request_hash, reservation_token, status, created_at, updated_at) VALUES (?, 'shopify', 'draft_product_create', 1, ?, ?, ?, 'reserved', ?, ?)`)
        .bind(input.workflowId, input.idempotencyKey, input.requestHash, input.reservationToken, now, now).run();
      const record = await this.getProviderRecord(input.workflowId, "shopify", "draft_product_create");
      if (!record) throw new GoodsProviderConflictError("The provider reservation could not be created.");
      if (record.requestHash !== input.requestHash) throw new GoodsProviderConflictError("The Shopify request changed; review the workflow before retrying.");
      if (record.status === "reserved" && record.reservationToken !== input.reservationToken) throw new GoodsProviderConflictError();
      return record;
    },

    async recordProviderDraftCreated(input, actor) {
      assertGoodsWritePermission(actor);
      return updateProviderRecord(database, input, "draft_created", input.externalId, input.externalUrl, null);
    },

    async recordProviderUnknown(input, actor) {
      assertGoodsWritePermission(actor);
      return updateProviderRecord(database, input, "unknown", null, null, input.message);
    },
  };
}

async function updateProviderRecord(database: GoodsD1Database, input: { workflowId: string; expectedVersion: number; reservationToken: string }, status: GoodsProviderRecord["status"], externalId: string | null, externalUrl: string | null, lastError: string | null): Promise<GoodsProviderRecord> {
  const now = new Date().toISOString();
  const result = await database.prepare(`UPDATE goods_provider_records SET version = version + 1, status = ?, external_id = ?, external_url = ?, last_error = ?, updated_at = ? WHERE workflow_id = ? AND provider = 'shopify' AND operation = 'draft_product_create' AND version = ? AND reservation_token = ? AND status = 'reserved'`)
    .bind(status, externalId, externalUrl, lastError, now, input.workflowId, input.expectedVersion, input.reservationToken).run();
  if (result.meta?.changes !== 1) throw new GoodsProviderConflictError("The provider reservation changed before it could be recorded.");
  const row = await database.prepare(`SELECT workflow_id, provider, operation, version, idempotency_key, request_hash, reservation_token, status, external_id, external_url, last_error, created_at, updated_at FROM goods_provider_records WHERE workflow_id = ? AND provider = 'shopify' AND operation = 'draft_product_create'`).bind(input.workflowId).first<ProviderRow>();
  if (!row) throw new GoodsProviderConflictError("The provider record could not be reloaded.");
  return toProviderRecord(row);
}

function toProviderRecord(row: ProviderRow): GoodsProviderRecord {
  return { workflowId: row.workflow_id, provider: row.provider, operation: row.operation, version: row.version, idempotencyKey: row.idempotency_key, requestHash: row.request_hash, reservationToken: row.reservation_token, status: row.status, externalId: row.external_id ?? undefined, externalUrl: row.external_url ?? undefined, lastError: row.last_error ?? undefined, createdAt: row.created_at, updatedAt: row.updated_at };
}
