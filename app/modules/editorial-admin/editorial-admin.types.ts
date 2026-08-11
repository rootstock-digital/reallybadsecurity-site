import type { EditorialStatus } from "../editorial/editorial.types";

// Keep these names aligned with Rootstock Starter's neutral contract. RBS
// remains independently deployable, so this is a compatibility boundary rather
// than a runtime dependency on the Starter repository.
export const editorialAdminRoles = ["writer", "reviewer", "publisher", "admin"] as const;

export const editorialRoles = editorialAdminRoles;

export type EditorialAdminRole = (typeof editorialAdminRoles)[number];
export type EditorialRole = EditorialAdminRole;

export type EditorialIdentity = Readonly<{
  subject: string;
  email?: string;
  displayName?: string;
}>;

export type EditorialAdminActor = Readonly<{
  subject: string;
  email?: string;
  displayName?: string;
  roles: readonly EditorialAdminRole[];
}>;

export type EditorialActor = EditorialAdminActor;

export type EditorialAdminDraftInput = Readonly<{
  title: string;
  slug: string;
  summary: string;
  format: string;
  series: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  canonicalMode: "local" | "external" | "owner-decision-required";
  canonicalUrl?: string;
}>;

export type EditorialDraftInput = EditorialAdminDraftInput;

export type EditorialAdminEntry = Readonly<{
  id: string;
  version: number;
  status: EditorialStatus;
  title: string;
  slug: string;
  summary: string;
  format: string;
  series: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  canonicalMode: EditorialDraftInput["canonicalMode"];
  canonicalUrl?: string;
  authorSubject: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}>;

export type EditorialAdminAction =
  | "created"
  | "updated"
  | "returned_to_draft"
  | "submitted_for_review"
  | "approved"
  | "published"
  | "retired";

export type EditorialAuditAction = EditorialAdminAction;

export type EditorialAdminRepository = Readonly<{
  listEntries(): Promise<readonly EditorialAdminEntry[]>;
  getEntry(id: string): Promise<EditorialAdminEntry>;
  createEntry(input: EditorialDraftInput, actor: EditorialActor): Promise<EditorialAdminEntry>;
  updateEntry(input: EditorialDraftInput & Readonly<{ id: string; expectedVersion: number }>, actor: EditorialActor): Promise<EditorialAdminEntry>;
  transitionEntry(input: Readonly<{ id: string; expectedVersion: number; nextStatus: EditorialStatus }>, actor: EditorialActor): Promise<EditorialAdminEntry>;
}>;

export type EditorialRepository = EditorialAdminRepository;

export class EditorialAccessError extends Error {
  constructor(message = "You do not have permission to perform that editorial action.") {
    super(message);
    this.name = "EditorialAccessError";
  }
}

export class EditorialConflictError extends Error {
  constructor(message = "This entry changed before your update was saved. Refresh and try again.") {
    super(message);
    this.name = "EditorialConflictError";
  }
}

export class EditorialValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EditorialValidationError";
  }
}
