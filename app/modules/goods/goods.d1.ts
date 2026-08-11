import { assertGoodsReadyToPublish, assertGoodsTransition, assertGoodsWritePermission } from "./goods.policy";
import {
  GoodsConflictError,
  type GoodsAuditEvent,
  type GoodsRepository,
  type GoodsWorkflowRecord,
} from "./goods.types";

type D1RunResult = Readonly<{ meta?: Readonly<{ changes?: number }> }>;
type D1Statement = Readonly<{
  bind(...values: readonly unknown[]): D1Statement;
  all<T>(): Promise<Readonly<{ results: readonly T[] }>>;
  first<T>(): Promise<T | null>;
  run(): Promise<D1RunResult>;
}>;

export type GoodsD1Database = Readonly<{
  prepare(query: string): D1Statement;
  batch(statements: readonly D1Statement[]): Promise<readonly unknown[]>;
}>;

type WorkflowRow = Readonly<{
  id: string; version: number; status: GoodsWorkflowRecord["status"]; design_name: string; design_code: string;
  product_title: string; format: string; source_of_truth: GoodsWorkflowRecord["sourceOfTruth"];
  assets_json: string; gates_json: string;
}>;
type AuditRow = Readonly<{
  id: string; workflow_id: string; action: GoodsAuditEvent["action"]; actor_subject: string;
  workflow_version: number; metadata_json: string; created_at: string;
}>;

export function createD1GoodsRepository(database: GoodsD1Database): GoodsRepository {
  return {
    async listWorkflows() {
      const result = await database.prepare(`SELECT w.id, w.version, w.status, w.design_name, w.design_code, w.product_title, w.format, w.source_of_truth, (SELECT json_group_array(json_object('id', id, 'kind', kind, 'label', label, 'status', status, 'altText', alt_text, 'sourceRef', source_ref)) FROM goods_workflow_assets WHERE workflow_id = w.id) AS assets_json, (SELECT json_group_array(json_object('id', id, 'label', label, 'required', required, 'status', status)) FROM goods_workflow_gates WHERE workflow_id = w.id) AS gates_json FROM goods_workflows w ORDER BY w.updated_at DESC, w.id DESC`).all<WorkflowRow>();
      return result.results.map(toWorkflow);
    },
    findWorkflow: (id) => findWorkflow(database, id),

    async createWorkflow(input, actor) {
      assertGoodsWritePermission(actor);
      const now = new Date().toISOString();
      const workflow = { ...input, version: 1, status: "draft" } satisfies GoodsWorkflowRecord;
      await database.batch([
        database.prepare(`INSERT INTO goods_workflows (id, version, status, design_name, design_code, product_title, format, source_of_truth, created_by_subject, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .bind(workflow.id, workflow.version, workflow.status, workflow.designName, workflow.designCode, workflow.productTitle, workflow.format, workflow.sourceOfTruth, actor.subject, now, now),
        ...workflow.assets.map((asset) => database.prepare(`INSERT INTO goods_workflow_assets (id, workflow_id, kind, label, status, alt_text, source_ref) VALUES (?, ?, ?, ?, ?, ?, ?)`)
          .bind(asset.id, workflow.id, asset.kind, asset.label, asset.status, asset.altText ?? null, asset.sourceRef ?? null)),
        ...workflow.approvalGates.map((gate) => database.prepare(`INSERT INTO goods_workflow_gates (id, workflow_id, label, required, status) VALUES (?, ?, ?, ?, ?)`)
          .bind(gate.id, workflow.id, gate.label, gate.required ? 1 : 0, gate.status)),
        auditInsert(database, workflow.id, "created", actor.subject, 1, now, "{}"),
      ]);
      return { ...workflow };
    },

    async updateAsset(input, actor) {
      assertGoodsWritePermission(actor);
      const existing = await requiredWorkflow(database, input.workflowId);
      const asset = existing.assets.find((item) => item.id === input.assetId);
      if (!asset) throw new GoodsConflictError("That goods asset no longer exists.");
      const nextVersion = input.expectedVersion + 1;
      const now = new Date().toISOString();
      const results = await database.batch([
        workflowVersionUpdate(database, input.workflowId, input.expectedVersion, nextVersion, now),
        database.prepare(`UPDATE goods_workflow_assets SET status = ?, source_ref = ?, alt_text = ? WHERE id = ? AND workflow_id = ? AND EXISTS (SELECT 1 FROM goods_workflows WHERE id = ? AND version = ? AND updated_at = ?)`)
          .bind(input.status, input.sourceRef ?? asset.sourceRef ?? null, input.altText ?? asset.altText ?? null, input.assetId, input.workflowId, input.workflowId, nextVersion, now),
        auditInsert(database, input.workflowId, "asset_updated", actor.subject, nextVersion, now, JSON.stringify({ assetId: input.assetId, status: input.status })),
      ]);
      assertMutationSucceeded(results);
      return requiredWorkflow(database, input.workflowId);
    },

    async updateGate(input, actor) {
      assertGoodsWritePermission(actor);
      const existing = await requiredWorkflow(database, input.workflowId);
      if (!existing.approvalGates.some((gate) => gate.id === input.gateId)) throw new GoodsConflictError("That approval gate no longer exists.");
      const nextVersion = input.expectedVersion + 1;
      const now = new Date().toISOString();
      const results = await database.batch([
        workflowVersionUpdate(database, input.workflowId, input.expectedVersion, nextVersion, now),
        database.prepare(`UPDATE goods_workflow_gates SET status = ? WHERE id = ? AND workflow_id = ? AND EXISTS (SELECT 1 FROM goods_workflows WHERE id = ? AND version = ? AND updated_at = ?)`)
          .bind(input.status, input.gateId, input.workflowId, input.workflowId, nextVersion, now),
        auditInsert(database, input.workflowId, "gate_updated", actor.subject, nextVersion, now, JSON.stringify({ gateId: input.gateId, status: input.status })),
      ]);
      assertMutationSucceeded(results);
      return requiredWorkflow(database, input.workflowId);
    },

    async transitionWorkflow(input, actor) {
      assertGoodsWritePermission(actor);
      const existing = await requiredWorkflow(database, input.workflowId);
      assertGoodsTransition(existing.status, input.nextStatus);
      if (input.nextStatus === "published") assertGoodsReadyToPublish(existing);
      const nextVersion = input.expectedVersion + 1;
      const now = new Date().toISOString();
      const action = input.nextStatus === "published" ? "published" : input.nextStatus === "retired" ? "retired" : "status_transitioned";
      const results = await database.batch([
        database.prepare(`UPDATE goods_workflows SET version = ?, status = ?, updated_at = ?, published_at = ? WHERE id = ? AND version = ? AND status = ?`)
          .bind(nextVersion, input.nextStatus, now, input.nextStatus === "published" ? now : null, input.workflowId, input.expectedVersion, existing.status),
        auditInsert(database, input.workflowId, action, actor.subject, nextVersion, now, JSON.stringify({ from: existing.status, to: input.nextStatus })),
      ]);
      assertMutationSucceeded(results);
      return requiredWorkflow(database, input.workflowId);
    },

    async listAuditEvents(workflowId) {
      const result = await database.prepare(`SELECT id, workflow_id, action, actor_subject, workflow_version, metadata_json, created_at FROM goods_workflow_audit_events WHERE workflow_id = ? ORDER BY created_at DESC, id DESC LIMIT 100`).bind(workflowId).all<AuditRow>();
      return result.results.map((row) => ({ id: row.id, workflowId: row.workflow_id, action: row.action, actorSubject: row.actor_subject, workflowVersion: row.workflow_version, metadata: parseMetadata(row.metadata_json), createdAt: row.created_at }));
    },
  };
}

async function findWorkflow(database: GoodsD1Database, id: string): Promise<GoodsWorkflowRecord | null> {
  const row = await database.prepare(`SELECT w.id, w.version, w.status, w.design_name, w.design_code, w.product_title, w.format, w.source_of_truth, (SELECT json_group_array(json_object('id', id, 'kind', kind, 'label', label, 'status', status, 'altText', alt_text, 'sourceRef', source_ref)) FROM goods_workflow_assets WHERE workflow_id = w.id) AS assets_json, (SELECT json_group_array(json_object('id', id, 'label', label, 'required', required, 'status', status)) FROM goods_workflow_gates WHERE workflow_id = w.id) AS gates_json FROM goods_workflows w WHERE w.id = ?`).bind(id).first<WorkflowRow>();
  return row ? toWorkflow(row) : null;
}

async function requiredWorkflow(database: GoodsD1Database, id: string): Promise<GoodsWorkflowRecord> {
  const workflow = await findWorkflow(database, id);
  if (!workflow) throw new GoodsConflictError("This goods workflow no longer exists.");
  return workflow;
}

function workflowVersionUpdate(database: GoodsD1Database, id: string, expectedVersion: number, nextVersion: number, now: string): D1Statement {
  return database.prepare(`UPDATE goods_workflows SET version = ?, updated_at = ? WHERE id = ? AND version = ?`).bind(nextVersion, now, id, expectedVersion);
}

function auditInsert(database: GoodsD1Database, workflowId: string, action: GoodsAuditEvent["action"], actor: string, version: number, now: string, metadata: string): D1Statement {
  return database.prepare(`INSERT INTO goods_workflow_audit_events (id, workflow_id, action, actor_subject, workflow_version, metadata_json, created_at) SELECT ?, ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM goods_workflows WHERE id = ? AND version = ? AND updated_at = ?)`).bind(crypto.randomUUID(), workflowId, action, actor, version, metadata, now, workflowId, version, now);
}

function assertMutationSucceeded(results: readonly unknown[]): void {
  if ((results[0] as D1RunResult | undefined)?.meta?.changes !== 1) throw new GoodsConflictError();
}

function toWorkflow(row: WorkflowRow): GoodsWorkflowRecord {
  return { id: row.id, version: row.version, status: row.status, designName: row.design_name, designCode: row.design_code, productTitle: row.product_title, format: row.format, sourceOfTruth: row.source_of_truth, assets: parseJson(row.assets_json), approvalGates: parseJson(row.gates_json) };
}

function parseJson<T>(value: string): T { return JSON.parse(value || "[]") as T; }
function parseMetadata(value: string): Readonly<Record<string, string>> { return JSON.parse(value || "{}") as Readonly<Record<string, string>>; }
