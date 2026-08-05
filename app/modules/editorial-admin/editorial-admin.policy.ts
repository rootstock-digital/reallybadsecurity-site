import type { EditorialStatus } from "../editorial/editorial.types";
import {
  EditorialAccessError,
  type EditorialActor,
  type EditorialAuditAction,
  type EditorialRole,
} from "./editorial-admin.types";

const actionRoles: Record<EditorialAuditAction, readonly EditorialRole[]> = {
  created: ["writer", "reviewer", "publisher", "admin"],
  updated: ["writer", "reviewer", "publisher", "admin"],
  returned_to_draft: ["reviewer", "publisher", "admin"],
  submitted_for_review: ["writer", "reviewer", "publisher", "admin"],
  approved: ["reviewer", "publisher", "admin"],
  published: ["publisher", "admin"],
  retired: ["publisher", "admin"],
};

const allowedTransitions: Record<EditorialStatus, readonly EditorialStatus[]> = {
  draft: ["in_review"],
  in_review: ["draft", "scheduled", "published"],
  scheduled: ["draft", "published"],
  published: ["retired"],
  retired: [],
};

export function assertEditorialPermission(actor: EditorialActor, action: EditorialAuditAction): void {
  if (!actionRoles[action].some((role) => actor.roles.includes(role))) {
    throw new EditorialAccessError();
  }
}

export function canPerformEditorialAction(actor: EditorialActor, action: EditorialAuditAction): boolean {
  return actionRoles[action].some((role) => actor.roles.includes(role));
}

export function getAllowedEditorialTransitions(currentStatus: EditorialStatus): readonly EditorialStatus[] {
  return allowedTransitions[currentStatus];
}

export function assertEditorialEditPermission(actor: EditorialActor, authorSubject: string): void {
  assertEditorialPermission(actor, "updated");
  const hasElevatedRole = actor.roles.some((role) => role !== "writer");
  if (!hasElevatedRole && actor.subject !== authorSubject) {
    throw new EditorialAccessError("Writers may update only their own drafts.");
  }
}

export function getEditorialTransitionAction(
  currentStatus: EditorialStatus,
  nextStatus: EditorialStatus,
): EditorialAuditAction {
  if (!allowedTransitions[currentStatus].includes(nextStatus)) {
    throw new EditorialAccessError(`Editorial entries cannot move from ${currentStatus} to ${nextStatus}.`);
  }

  if (nextStatus === "in_review") return "submitted_for_review";
  if (nextStatus === "draft") return "returned_to_draft";
  if (nextStatus === "published") return "published";
  if (nextStatus === "retired") return "retired";
  return "approved";
}
