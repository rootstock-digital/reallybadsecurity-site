import { describe, expect, it } from "vitest";

import { createD1GoodsRepository, type GoodsD1Database } from "./goods.d1";
import type { GoodsWorkflowRecord } from "./goods.types";

const baseWorkflow: GoodsWorkflowRecord = {
  id: "workflow-1",
  version: 2,
  designName: "Test design",
  designCode: "TEST",
  productTitle: "Test product",
  format: "Test format",
  status: "approved",
  sourceOfTruth: "client-workflow",
  assets: [{ id: "asset-1", kind: "product_mockup", label: "Mockup", status: "ready" }],
  approvalGates: [{ id: "design", label: "Design", required: true, status: "passed" }],
};

class FakeD1 {
  workflow = { ...baseWorkflow, updatedAt: "2026-01-01T00:00:00.000Z" };
  audit: Array<{ action: string; version: number; metadata: string }> = [];

  prepare(query: string) {
    return new FakeStatement(this, query);
  }

  async batch(statements: readonly FakeStatement[]) {
    return statements.map((statement) => statement.execute());
  }
}

class FakeStatement {
  private values: readonly unknown[] = [];
  constructor(private readonly db: FakeD1, private readonly query: string) {}
  bind(...values: readonly unknown[]) { this.values = values; return this; }
  async first<T>() {
    if (this.query.includes("SELECT w.id")) {
      return {
        id: this.db.workflow.id, version: this.db.workflow.version, status: this.db.workflow.status,
        design_name: this.db.workflow.designName, design_code: this.db.workflow.designCode,
        product_title: this.db.workflow.productTitle, format: this.db.workflow.format,
        source_of_truth: this.db.workflow.sourceOfTruth,
        assets_json: JSON.stringify(this.db.workflow.assets), gates_json: JSON.stringify(this.db.workflow.approvalGates),
      } as T;
    }
    return null;
  }
  async all<T>() {
    return { results: this.db.audit.map((event, index) => ({ id: String(index), workflow_id: this.db.workflow.id, action: event.action, actor_subject: "test-subject", workflow_version: event.version, metadata_json: event.metadata, created_at: "2026-01-01T00:00:00.000Z" })) as T[] };
  }
  async run() { return this.execute(); }
  execute() {
    if (this.query.includes("UPDATE goods_workflows SET version = ?, status")) {
      const [nextVersion, status, now, , id, expectedVersion, currentStatus] = this.values as [number, GoodsWorkflowRecord["status"], string, string | null, string, number, GoodsWorkflowRecord["status"]];
      if (id !== this.db.workflow.id || expectedVersion !== this.db.workflow.version || currentStatus !== this.db.workflow.status) return { meta: { changes: 0 } };
      this.db.workflow = { ...this.db.workflow, version: nextVersion, status, updatedAt: now };
      return { meta: { changes: 1 } };
    }
    if (this.query.includes("UPDATE goods_workflows SET version = ?")) {
      const [nextVersion, now, id, expectedVersion] = this.values as [number, string, string, number];
      if (id !== this.db.workflow.id || expectedVersion !== this.db.workflow.version) return { meta: { changes: 0 } };
      this.db.workflow = { ...this.db.workflow, version: nextVersion, updatedAt: now };
      return { meta: { changes: 1 } };
    }
    if (this.query.includes("UPDATE goods_workflow_gates SET status")) {
      const [status, gateId, workflowId, , expectedVersion, now] = this.values as [GoodsWorkflowRecord["approvalGates"][number]["status"], string, string, string, number, string];
      if (workflowId !== this.db.workflow.id || this.db.workflow.version !== expectedVersion || this.db.workflow.updatedAt !== now) return { meta: { changes: 0 } };
      this.db.workflow = { ...this.db.workflow, approvalGates: this.db.workflow.approvalGates.map((gate) => gate.id === gateId ? { ...gate, status } : gate) };
      return { meta: { changes: 1 } };
    }
    if (this.query.includes("INSERT INTO goods_workflow_audit_events")) {
      const [, , action, , version, metadata, , workflowId, expectedVersion, now] = this.values as [string, string, string, string, number, string, string, string, number, string];
      if (workflowId === this.db.workflow.id && expectedVersion === this.db.workflow.version && now === this.db.workflow.updatedAt) this.db.audit.push({ action, version, metadata });
      return { meta: { changes: 1 } };
    }
    return { meta: { changes: 1 } };
  }
}

describe("Goods D1 repository", () => {
  it("rejects a stale gate update without changing the gate or writing audit evidence", async () => {
    const db = new FakeD1();
    const repository = createD1GoodsRepository(db as unknown as GoodsD1Database);
    await expect(repository.updateGate({ workflowId: "workflow-1", gateId: "design", expectedVersion: 1, status: "blocked" }, { subject: "test-subject", roles: ["admin"] })).rejects.toThrow("changed before");
    expect(db.workflow.version).toBe(2);
    expect(db.workflow.approvalGates[0]?.status).toBe("passed");
    expect(db.audit).toHaveLength(0);
  });

  it("increments the workflow version and audits a valid gate update", async () => {
    const db = new FakeD1();
    const repository = createD1GoodsRepository(db as unknown as GoodsD1Database);
    const result = await repository.updateGate({ workflowId: "workflow-1", gateId: "design", expectedVersion: 2, status: "in_progress" }, { subject: "test-subject", roles: ["admin"] });
    expect(result.version).toBe(3);
    expect(result.approvalGates[0]?.status).toBe("in_progress");
    expect(db.audit).toEqual([{ action: "gate_updated", version: 3, metadata: '{"gateId":"design","status":"in_progress"}' }]);
  });

  it("audits an approved-to-published transition", async () => {
    const db = new FakeD1();
    const repository = createD1GoodsRepository(db as unknown as GoodsD1Database);
    const result = await repository.transitionWorkflow({ workflowId: "workflow-1", expectedVersion: 2, nextStatus: "published" }, { subject: "test-subject", roles: ["admin"] });
    expect(result.status).toBe("published");
    expect(result.version).toBe(3);
    expect(db.audit).toEqual([{ action: "published", version: 3, metadata: '{"from":"approved","to":"published"}' }]);
  });
});
