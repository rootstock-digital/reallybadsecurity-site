"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getEditorialWorkspace } from "../modules/editorial-admin";
import { editorialStatuses, type EditorialStatus } from "../modules/editorial/editorial.types";

export async function createEditorialDraft(formData: FormData): Promise<void> {
  const workspace = await getEditorialWorkspace(await headers());
  if (!workspace) redirect("/");

  await workspace.repository.createEntry(
    {
      title: field(formData, "title"),
      slug: field(formData, "slug"),
      summary: field(formData, "summary"),
      format: field(formData, "format"),
      series: field(formData, "series"),
      body: field(formData, "body"),
      seoTitle: field(formData, "seoTitle"),
      seoDescription: field(formData, "seoDescription"),
      canonicalMode: canonicalMode(field(formData, "canonicalMode")),
      canonicalUrl: optionalField(formData, "canonicalUrl"),
    },
    workspace.actor,
  );

  redirect("/editorial");
}

export async function updateEditorialDraft(formData: FormData): Promise<void> {
  const workspace = await getEditorialWorkspace(await headers());
  if (!workspace) redirect("/");

  const id = field(formData, "id");
  const expectedVersion = Number.parseInt(field(formData, "expectedVersion"), 10);
  if (!id || !Number.isSafeInteger(expectedVersion) || expectedVersion < 1) {
    throw new Error("The article update is invalid. Refresh the page and try again.");
  }

  await workspace.repository.updateEntry(
    {
      id,
      expectedVersion,
      title: field(formData, "title"),
      slug: field(formData, "slug"),
      summary: field(formData, "summary"),
      format: field(formData, "format"),
      series: field(formData, "series"),
      body: field(formData, "body"),
      seoTitle: field(formData, "seoTitle"),
      seoDescription: field(formData, "seoDescription"),
      canonicalMode: canonicalMode(field(formData, "canonicalMode")),
      canonicalUrl: optionalField(formData, "canonicalUrl"),
    },
    workspace.actor,
  );

  redirect(`/editorial/${id}`);
}

export async function transitionEditorialEntry(formData: FormData): Promise<void> {
  const workspace = await getEditorialWorkspace(await headers());
  if (!workspace) redirect("/");

  const id = field(formData, "id");
  const expectedVersion = Number.parseInt(field(formData, "expectedVersion"), 10);
  const nextStatus = editorialStatus(field(formData, "nextStatus"));
  if (!id || !Number.isSafeInteger(expectedVersion) || expectedVersion < 1 || !nextStatus) {
    throw new Error("The editorial status update is invalid. Refresh the page and try again.");
  }

  await workspace.repository.transitionEntry({ id, expectedVersion, nextStatus }, workspace.actor);
  redirect(`/editorial/${id}`);
}

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function optionalField(formData: FormData, name: string): string | undefined {
  const value = field(formData, name).trim();
  return value || undefined;
}

function canonicalMode(value: string): "local" | "external" | "owner-decision-required" {
  if (value === "local" || value === "external" || value === "owner-decision-required") return value;
  return "owner-decision-required";
}

function editorialStatus(value: string): EditorialStatus | undefined {
  return editorialStatuses.find((status) => status === value);
}
