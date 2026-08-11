import type { EditorialActor } from "../editorial-admin/editorial-admin.types";

export const goodsWorkflowStatuses = ["draft", "in_review", "approved", "published", "retired"] as const;
export const goodsAssetStatuses = ["missing", "in_progress", "ready", "approved"] as const;
export const goodsGateStatuses = ["not_started", "in_progress", "passed", "blocked"] as const;

export type GoodsWorkflowStatus = (typeof goodsWorkflowStatuses)[number];
export type GoodsAssetStatus = (typeof goodsAssetStatuses)[number];
export type GoodsGateStatus = (typeof goodsGateStatuses)[number];

export type GoodsWorkflowRecord = Readonly<{
  id: string;
  version: number;
  designName: string;
  designCode: string;
  productTitle: string;
  format: string;
  status: GoodsWorkflowStatus;
  sourceOfTruth: "shopify" | "client-workflow";
  assets: readonly Readonly<{
    id: string;
    kind: "source_artwork" | "production_artwork" | "product_mockup" | "detail_view" | "lifestyle" | "size_guide" | "provenance";
    label: string;
    status: GoodsAssetStatus;
    altText?: string;
    sourceRef?: string;
  }>[];
  approvalGates: readonly Readonly<{
    id: string;
    label: string;
    required: boolean;
    status: GoodsGateStatus;
  }>[];
}>;

export type GoodsAuditEvent = Readonly<{
  id: string;
  workflowId: string;
  action: "created" | "asset_updated" | "gate_updated" | "status_transitioned" | "published" | "retired";
  actorSubject: string;
  workflowVersion: number;
  metadata: Readonly<Record<string, string>>;
  createdAt: string;
}>;

export type GoodsRepository = Readonly<{
  listWorkflows(): Promise<readonly GoodsWorkflowRecord[]>;
  findWorkflow(id: string): Promise<GoodsWorkflowRecord | null>;
  createWorkflow(input: GoodsWorkflowRecord, actor: EditorialActor): Promise<GoodsWorkflowRecord>;
  updateAsset(input: Readonly<{ workflowId: string; assetId: string; expectedVersion: number; status: GoodsAssetStatus; sourceRef?: string; altText?: string }>, actor: EditorialActor): Promise<GoodsWorkflowRecord>;
  updateGate(input: Readonly<{ workflowId: string; gateId: string; expectedVersion: number; status: GoodsGateStatus }>, actor: EditorialActor): Promise<GoodsWorkflowRecord>;
  transitionWorkflow(input: Readonly<{ workflowId: string; expectedVersion: number; nextStatus: GoodsWorkflowStatus }>, actor: EditorialActor): Promise<GoodsWorkflowRecord>;
  listAuditEvents(workflowId: string): Promise<readonly GoodsAuditEvent[]>;
}>;

export class GoodsAccessError extends Error {
  constructor(message = "You do not have permission to manage goods workflows.") { super(message); this.name = "GoodsAccessError"; }
}

export class GoodsConflictError extends Error {
  constructor(message = "This goods workflow changed before your update was saved. Refresh and try again.") { super(message); this.name = "GoodsConflictError"; }
}
