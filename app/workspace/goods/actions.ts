"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  goodsAssetStatuses,
  goodsGateStatuses,
  goodsWorkflowStatuses,
  getGoodsWorkspace,
  createGoodsWorkflowFromPilot,
  vibeCodesOnlyPilot,
  GoodsConflictError,
  GoodsProviderConflictError,
  createShopifyDraftWithIdempotency,
  storeGoodsArtwork,
  type GoodsAssetStatus,
  type GoodsGateStatus,
  type GoodsWorkflowStatus,
} from "../../modules/goods";

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== "string" || value.trim() === "") throw new Error(`Missing ${name}.`);
  return value.trim();
}
function version(formData: FormData): number {
  const value = Number(text(formData, "expectedVersion"));
  if (!Number.isInteger(value) || value < 1) throw new Error("Invalid workflow version.");
  return value;
}
function oneOf<T extends readonly string[]>(value: string, values: T): T[number] {
  if (!values.includes(value)) throw new Error("Invalid workflow value.");
  return value as T[number];
}

async function runGoodsMutation(mutation: () => Promise<unknown>): Promise<void> {
  try {
    await mutation();
  } catch (error) {
    if (error instanceof GoodsConflictError) redirect("/workspace/goods?error=conflict");
    throw error;
  }
}

async function runProviderMutation(mutation: () => Promise<unknown>): Promise<void> {
  try {
    await mutation();
  } catch (error) {
    if (error instanceof GoodsConflictError) redirect("/workspace/goods?error=conflict");
    if (error instanceof GoodsProviderConflictError) redirect("/workspace/goods?error=provider-conflict");
    throw error;
  }
}

export async function initializeVibeCodesOnlyWorkflow() {
  const workspace = await getGoodsWorkspace(await headers());
  if (!workspace) redirect("/");
  await workspace.repository.createWorkflow(vibeCodesOnlyPilot, workspace.actor);
  redirect("/workspace/goods");
}

export async function createGoodsDesign(formData: FormData) {
  const workspace = await getGoodsWorkspace(await headers());
  if (!workspace) redirect("/");
  const designName = text(formData, "designName");
  const format = text(formData, "format");
  const productTitle = `${designName} — ${format}`;
  const designCode = `DES-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const workflow = createGoodsWorkflowFromPilot({ id: `goods-${crypto.randomUUID()}`, designName, designCode, productTitle, format });
  await workspace.repository.createWorkflow(workflow, workspace.actor);
  redirect(`/workspace/goods?workflow=${encodeURIComponent(workflow.id)}`);
}

export async function updateGoodsAsset(formData: FormData) {
  const workspace = await getGoodsWorkspace(await headers());
  if (!workspace) redirect("/");
  await runGoodsMutation(() => workspace.repository.updateAsset({
    workflowId: text(formData, "workflowId"), assetId: text(formData, "assetId"), expectedVersion: version(formData),
    status: oneOf(text(formData, "status"), goodsAssetStatuses) as GoodsAssetStatus,
    sourceRef: formData.get("sourceRef")?.toString().trim() || undefined,
    altText: formData.get("altText")?.toString().trim() || undefined,
  }, workspace.actor));
  redirect("/workspace/goods");
}

export async function uploadGoodsArtwork(formData: FormData) {
  const workspace = await getGoodsWorkspace(await headers());
  if (!workspace) redirect("/");
  if (!workspace.assetBucket) throw new Error("Goods asset storage is not configured.");
  const workflowId = text(formData, "workflowId");
  const workflow = await workspace.repository.findWorkflow(workflowId);
  if (!workflow) redirect("/workspace/goods");
  const sourceAsset = workflow.assets.find((asset) => asset.kind === "source_artwork");
  if (!sourceAsset) throw new Error("This workflow does not have a source artwork slot.");
  const file = formData.get("artwork");
  if (!(file instanceof File)) throw new Error("Choose an artwork file first.");
  const uploaded = await storeGoodsArtwork(workspace.assetBucket, workflow.id, file);
  try {
    await runGoodsMutation(() => workspace.repository.updateAsset({ workflowId: workflow.id, assetId: sourceAsset.id, expectedVersion: workflow.version, status: uploaded.status, sourceRef: uploaded.sourceRef, altText: uploaded.altText }, workspace.actor));
  } catch (error) {
    await workspace.assetBucket.delete(uploaded.sourceRef.replace("/api/workspace/goods/assets/", "")).catch(() => undefined);
    throw error;
  }
  redirect(`/workspace/goods?workflow=${encodeURIComponent(workflow.id)}`);
}

export async function updateGoodsGate(formData: FormData) {
  const workspace = await getGoodsWorkspace(await headers());
  if (!workspace) redirect("/");
  await runGoodsMutation(() => workspace.repository.updateGate({ workflowId: text(formData, "workflowId"), gateId: text(formData, "gateId"), expectedVersion: version(formData), status: oneOf(text(formData, "status"), goodsGateStatuses) as GoodsGateStatus }, workspace.actor));
  redirect("/workspace/goods");
}

export async function transitionGoodsWorkflow(formData: FormData) {
  const workspace = await getGoodsWorkspace(await headers());
  if (!workspace) redirect("/");
  await runGoodsMutation(() => workspace.repository.transitionWorkflow({ workflowId: text(formData, "workflowId"), expectedVersion: version(formData), nextStatus: oneOf(text(formData, "nextStatus"), goodsWorkflowStatuses) as GoodsWorkflowStatus }, workspace.actor));
  redirect("/workspace/goods");
}

export async function createShopifyDraftProduct(formData: FormData) {
  const workspace = await getGoodsWorkspace(await headers());
  if (!workspace) redirect("/");
  if (!workspace.shopifyAdminClient) throw new Error("The Shopify staging integration is not configured.");
  const workflow = await workspace.repository.findWorkflow(text(formData, "workflowId"));
  if (!workflow) redirect("/workspace/goods");
  await runProviderMutation(() => createShopifyDraftWithIdempotency(workflow, workspace.actor, workspace.providerRepository, workspace.shopifyAdminClient!));
  redirect("/workspace/goods?shopify=created");
}
