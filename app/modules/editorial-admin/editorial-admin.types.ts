import type { EditorialStatus } from "../editorial/editorial.types";

export const editorialRoles = ["writer", "reviewer", "publisher", "admin"] as const;

export type EditorialRole = (typeof editorialRoles)[number];

export type EditorialIdentity = Readonly<{
  subject: string;
  email?: string;
  displayName?: string;
}>;

export type EditorialActor = Readonly<{
  subject: string;
  email?: string;
  displayName?: string;
  roles: readonly EditorialRole[];
}>;

export type EditorialDraftInput = Readonly<{
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

export type EditorialAuditAction =
  | "created"
  | "updated"
  | "returned_to_draft"
  | "submitted_for_review"
  | "approved"
  | "published"
  | "retired";

export type EditorialRepository = Readonly<{
  listEntries(): Promise<readonly EditorialAdminEntry[]>;
  getEntry(id: string): Promise<EditorialAdminEntry>;
  createEntry(input: EditorialDraftInput, actor: EditorialActor): Promise<EditorialAdminEntry>;
  updateEntry(input: EditorialDraftInput & Readonly<{ id: string; expectedVersion: number }>, actor: EditorialActor): Promise<EditorialAdminEntry>;
  transitionEntry(input: Readonly<{ id: string; expectedVersion: number; nextStatus: EditorialStatus }>, actor: EditorialActor): Promise<EditorialAdminEntry>;
}>;

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
