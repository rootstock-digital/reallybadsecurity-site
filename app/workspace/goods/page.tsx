import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { getGoodsWorkspace, getAllowedGoodsTransitions, type GoodsAuditEvent, type GoodsProviderRecord, type GoodsWorkflowRecord } from "../../modules/goods";
import { WorkspaceShell, workspaceModules } from "../../modules/workspace";
import { createGoodsDesign, createShopifyDraftProduct, initializeVibeCodesOnlyWorkflow, transitionGoodsWorkflow, updateGoodsAsset, updateGoodsGate, uploadGoodsArtwork } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Goods", robots: { index: false, follow: false } };

export default async function WorkspaceGoodsPage({ searchParams }: { searchParams?: Promise<{ error?: string | string[]; shopify?: string | string[]; workflow?: string | string[] }> }) {
  const workspace = await getGoodsWorkspace(await headers());
  if (!workspace || !workspace.actor.roles.some((role) => role === "admin" || role === "publisher")) notFound();
  const workflows = await workspace.repository.listWorkflows();
  const params = await searchParams;
  const requestedWorkflow = typeof params?.workflow === "string" ? params.workflow : undefined;
  const workflow = (requestedWorkflow ? workflows.find((item) => item.id === requestedWorkflow) : workflows[0]) ?? null;
  const error = params?.error;
  const shopify = params?.shopify;
  const conflict = error === "conflict";
  const providerConflict = error === "provider-conflict";

  return (
    <WorkspaceShell actor={workspace.actor} modules={workspaceModules} name="Really Bad Security Workspace" contextLabel="Rootstock Digital workspace">
      {conflict && <ConflictNotice />}
      {providerConflict && <ProviderConflictNotice />}
      {shopify === "created" && <ShopifyCreatedNotice />}
      <NewDesignPanel />
      {workflows.length > 0 && <WorkflowPicker workflows={workflows} selectedId={workflow?.id} />}
      {!workflow ? <EmptyGoodsState /> : <GoodsWorkflow workflow={workflow} providerRecord={await workspace.providerRepository.getProviderRecord(workflow.id, "shopify", "draft_product_create")} auditEvents={await workspace.repository.listAuditEvents(workflow.id)} />}
    </WorkspaceShell>
  );
}

function ConflictNotice() {
  return <aside className="goods-conflict-notice" role="alert"><strong>This workflow was updated elsewhere.</strong><span>Your change was not applied. The page has been refreshed with the latest version; review it before saving again.</span></aside>;
}

function ProviderConflictNotice() {
  return <aside className="goods-conflict-notice" role="alert"><strong>Shopify needs reconciliation.</strong><span>The previous request may have reached Shopify. No retry was started. Review the provider record before trying again.</span></aside>;
}

function ShopifyCreatedNotice() {
  return <aside className="goods-success-notice" role="status"><strong>Shopify draft created.</strong><span>The product remains unpublished. Review it in the staging Shopify admin before any later approval step.</span></aside>;
}

function EmptyGoodsState() {
  return <section className="goods-workflow-section"><span className="eyebrow">Custom mockup builder</span><h1>Start your first mockup project</h1><p>Upload a design, choose the product, create the mockup, approve it, and then send the finished product to Shopify as an unpublished draft.</p><form action={initializeVibeCodesOnlyWorkflow}><button className="goods-action-button" type="submit">Start Vibe Codes Only project</button></form></section>;
}

function NewDesignPanel() {
  return <section className="goods-new-design-panel"><div><span className="label">Start here · Step 1</span><h2>Create a custom mockup</h2><p>Name the design and choose the product. We’ll generate the internal reference and customer-facing product title for you.</p></div><form action={createGoodsDesign} className="goods-new-design-form"><label>Design name<input name="designName" placeholder="Example: Vibe Codes Only" required /></label><label>What are you making?<select name="format" defaultValue="" required><option value="" disabled>Select a product type</option><option value="Heavyweight short-sleeve tee">T-shirt</option><option value="Pullover hoodie">Hoodie</option><option value="Ceramic mug">Mug</option><option value="Structured hat">Hat</option></select></label><button className="goods-action-button" type="submit">Create mockup project</button></form></section>;
}

function WorkflowPicker({ workflows, selectedId }: { workflows: readonly GoodsWorkflowRecord[]; selectedId?: string }) {
  return <nav className="goods-workflow-picker" aria-label="Mockup projects"><span className="label">Your mockup projects</span>{workflows.map((item) => <Link key={item.id} className={item.id === selectedId ? "is-selected" : ""} href={`/workspace/goods?workflow=${encodeURIComponent(item.id)}`}><strong>{item.designName}</strong><span>{item.status.replaceAll("_", " ")} · v{item.version}</span></Link>)}</nav>;
}

function GoodsWorkflow({ workflow, providerRecord, auditEvents }: { workflow: GoodsWorkflowRecord; providerRecord: GoodsProviderRecord | null; auditEvents: readonly GoodsAuditEvent[] }) {
  const readyAssets = workflow.assets.filter((asset) => asset.status !== "missing").length;
  const passedGates = workflow.approvalGates.filter((gate) => gate.status === "passed").length;
  const allowedTransitions = getAllowedGoodsTransitions(workflow.status);
  const sourceArtwork = workflow.assets.find((asset) => asset.kind === "source_artwork");
  return <>
    <header className="goods-workflow-header"><div><span className="eyebrow">Custom mockup project · version {workflow.version}</span><h1>{workflow.designName}</h1><p>Turn one design into an approved product mockup and an unpublished Shopify draft.</p><div className="goods-step-strip"><span className="is-current">1 Design</span><span>2 Product</span><span>3 Mockup</span><span>4 Approve</span><span>5 Shopify</span></div></div><div className="goods-workflow-state"><span>Project state</span><strong>{workflow.status}</strong><small>{providerRecord?.status === "draft_created" ? "Shopify draft recorded" : "No Shopify product created"}</small></div></header>
    <div className="goods-workflow-grid">
      <section className="goods-workflow-card goods-workflow-preview" aria-labelledby="goods-preview-heading"><div className="goods-workflow-card-heading"><span className="label">Step 1 · Design artwork</span><h2 id="goods-preview-heading">Upload the artwork</h2></div><div className="goods-artwork-frame">{sourceArtwork?.sourceRef ? <Image src={sourceArtwork.sourceRef} alt={sourceArtwork.altText ?? `${workflow.designName} source artwork.`} width={1200} height={1200} priority /> : <p className="goods-artwork-empty">Upload the design file to begin.</p>}</div><form action={uploadGoodsArtwork} className="goods-artwork-upload"><input type="hidden" name="workflowId" value={workflow.id} /><input type="file" name="artwork" accept="image/png,image/jpeg,image/webp,image/svg+xml" required /><button className="goods-action-button" type="submit">Upload artwork</button></form></section>
      <section className="goods-workflow-card" aria-labelledby="goods-brief-heading"><div className="goods-workflow-card-heading"><span className="label">Step 2 · Product details</span><h2 id="goods-brief-heading">Product brief</h2></div><dl className="goods-brief-list"><div><dt>Product title</dt><dd>{workflow.productTitle}</dd></div><div><dt>Internal reference</dt><dd><code>{workflow.designCode}</code></dd></div><div><dt>Product type</dt><dd>{workflow.format}</dd></div><div><dt>Source of truth</dt><dd>{workflow.sourceOfTruth === "client-workflow" ? "Internal project until Shopify draft exists" : "Shopify"}</dd></div></dl><p className="goods-workflow-warning">The product title can be refined before the Shopify draft is created. Nothing is sent to Shopify yet.</p></section>
    </div>
    <section className="goods-workflow-section" aria-labelledby="goods-assets-heading"><div className="goods-workflow-section-heading"><span className="label">Step 3 · Mockup package</span><h2 id="goods-assets-heading">{readyAssets} of {workflow.assets.length} assets prepared</h2></div><p className="goods-section-intro">Once the design and product are selected, this is where the system will create the front mockup, detail view, and optional lifestyle scene.</p><ul className="goods-checklist">{workflow.assets.map((asset) => <li key={asset.id}><span className={`goods-check goods-check-${asset.status}`} aria-hidden="true">{asset.status === "ready" ? "✓" : asset.status === "approved" ? "✓✓" : "—"}</span><div><strong>{asset.label}</strong><small>{asset.kind.replaceAll("_", " ")}</small></div><form action={updateGoodsAsset} className="goods-inline-form"><input type="hidden" name="workflowId" value={workflow.id} /><input type="hidden" name="assetId" value={asset.id} /><input type="hidden" name="expectedVersion" value={workflow.version} /><select name="status" defaultValue={asset.status} aria-label={`${asset.label} status`}><option value="missing">Missing</option><option value="in_progress">In progress</option><option value="ready">Ready</option><option value="approved">Approved</option></select><button type="submit">Save</button></form></li>)}</ul></section>
    <details className="goods-advanced-controls"><summary>Advanced approval controls</summary><section className="goods-workflow-section" aria-labelledby="goods-gates-heading"><div className="goods-workflow-section-heading"><span className="label">Step 4 · Approve</span><h2 id="goods-gates-heading">{passedGates} of {workflow.approvalGates.length} approvals complete</h2></div><ol className="goods-approval-list">{workflow.approvalGates.map((gate, index) => <li key={gate.id}><span className="goods-approval-number">{index + 1}</span><div><strong>{gate.label}</strong><small>{gate.required ? "Required before publication" : "Optional"}</small></div><form action={updateGoodsGate} className="goods-inline-form"><input type="hidden" name="workflowId" value={workflow.id} /><input type="hidden" name="gateId" value={gate.id} /><input type="hidden" name="expectedVersion" value={workflow.version} /><select name="status" defaultValue={gate.status} aria-label={`${gate.label} status`}><option value="not_started">Not started</option><option value="in_progress">In progress</option><option value="passed">Passed</option><option value="blocked">Blocked</option></select><button type="submit">Save</button></form></li>)}</ol></section><section className="goods-workflow-section"><div className="goods-workflow-section-heading"><span className="label">Project status</span><h2>Move this project forward</h2></div><form action={transitionGoodsWorkflow} className="goods-transition-form"><input type="hidden" name="workflowId" value={workflow.id} /><input type="hidden" name="expectedVersion" value={workflow.version} /><select name="nextStatus" defaultValue={allowedTransitions[0] ?? ""} aria-label="Next project status" disabled={allowedTransitions.length === 0}>{allowedTransitions.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select><button className="goods-action-button" type="submit" disabled={allowedTransitions.length === 0}>Save project status</button></form></section></details>
    <section className="goods-workflow-section goods-shopify-step"><div className="goods-workflow-section-heading"><span className="label">Step 5 · Shopify</span><h2>Create the store draft</h2></div>{workflow.status === "approved" && !providerRecord && <form action={createShopifyDraftProduct} className="goods-provider-confirmation"><p><strong>Ready to create the Shopify draft?</strong> This sends the approved product details to the isolated staging store. It remains unpublished.</p><input type="hidden" name="workflowId" value={workflow.id} /><button className="goods-action-button" type="submit">Create unpublished Shopify draft</button></form>}{providerRecord?.status === "draft_created" && providerRecord.externalUrl && <p className="goods-provider-result">Draft created: <a href={providerRecord.externalUrl}>Review it in Shopify admin</a></p>}{workflow.status !== "approved" && <p className="goods-workflow-warning">Finish the mockup and approval steps first. Shopify stays untouched until you explicitly approve the project.</p>}</section>
    <details className="goods-advanced-controls"><summary>Audit history</summary><ul className="goods-audit-list">{auditEvents.map((event) => <li key={event.id}><strong>{event.action.replaceAll("_", " ")}</strong><span>v{event.workflowVersion}</span><time dateTime={event.createdAt}>{event.createdAt}</time></li>)}</ul></details>
    <footer className="goods-workflow-footer"><Link className="text-link" href="/workspace">← Workspace overview</Link><span>Next handoff: create the custom mockup package manually in the isolated provider workflow.</span></footer>
  </>;
}
