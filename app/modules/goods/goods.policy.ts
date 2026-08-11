import type { EditorialActor } from "../editorial-admin/editorial-admin.types";
import { GoodsAccessError, type GoodsWorkflowRecord, type GoodsWorkflowStatus } from "./goods.types";

const writeRoles = ["publisher", "admin"] as const;
const transitions: Record<GoodsWorkflowStatus, readonly GoodsWorkflowStatus[]> = {
  draft: ["in_review"],
  in_review: ["draft", "approved"],
  approved: ["in_review", "published"],
  published: ["retired"],
  retired: [],
};

export function assertGoodsWritePermission(actor: EditorialActor): void {
  if (!actor.roles.some((role) => writeRoles.includes(role as (typeof writeRoles)[number]))) throw new GoodsAccessError();
}

export function getAllowedGoodsTransitions(status: GoodsWorkflowStatus): readonly GoodsWorkflowStatus[] {
  return transitions[status];
}

export function assertGoodsTransition(current: GoodsWorkflowStatus, next: GoodsWorkflowStatus): void {
  if (!transitions[current].includes(next)) throw new GoodsAccessError(`Goods workflows cannot move from ${current} to ${next}.`);
}

export function assertGoodsReadyToPublish(workflow: Pick<GoodsWorkflowRecord, "approvalGates">): void {
  if (workflow.approvalGates.some((gate) => gate.required && gate.status !== "passed")) {
    throw new GoodsAccessError("Every required approval gate must pass before publication.");
  }
}

export function assertGoodsReadyForShopifyDraft(workflow: Pick<GoodsWorkflowRecord, "approvalGates">): void {
  const providerFollowUpGates = new Set(["shopify", "publish"]);
  if (workflow.approvalGates.some((gate) => gate.required && !providerFollowUpGates.has(gate.id) && gate.status !== "passed")) {
    throw new GoodsAccessError("Design, mockup, and sample approvals must pass before creating the Shopify draft.");
  }
}
