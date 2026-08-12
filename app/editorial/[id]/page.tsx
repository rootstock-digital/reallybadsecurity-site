import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import EditorialShell from "../../components/EditorialShell";
import { transitionEditorialEntry } from "../actions";
import {
  canPerformEditorialAction,
  getEditorialWorkspace,
  type EditorialAdminEntry,
  type EditorialAuditAction,
} from "../../modules/editorial-admin";
import type { EditorialStatus } from "../../modules/editorial/editorial.types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review article",
  robots: { index: false, follow: false },
};

const statusCopy: Record<EditorialStatus, string> = {
  draft: "Private draft. Only editorial workspace members can see it.",
  in_review: "In review. It is ready for an editor to check facts, voice, and search preview.",
  scheduled: "Approved and ready to publish. It remains private until you choose Publish article.",
  published: "Published on the public site. You can edit the article and republish changes at any time.",
  retired: "Retired. It remains in the private audit trail and is no longer eligible for public delivery.",
};

type TransitionControl = Readonly<{
  nextStatus: EditorialStatus;
  label: string;
  action: EditorialAuditAction;
}>;

const transitionControls: Record<EditorialStatus, readonly TransitionControl[]> = {
  draft: [{ nextStatus: "in_review", label: "Send to review", action: "submitted_for_review" }],
  in_review: [
    { nextStatus: "draft", label: "Return to draft", action: "returned_to_draft" },
    { nextStatus: "scheduled", label: "Approve for publishing", action: "approved" },
    { nextStatus: "published", label: "Publish article", action: "published" },
  ],
  scheduled: [
    { nextStatus: "draft", label: "Return to draft", action: "returned_to_draft" },
    { nextStatus: "published", label: "Publish article", action: "published" },
  ],
  published: [{ nextStatus: "retired", label: "Retire article", action: "retired" }],
  retired: [],
};

export default async function EditorialReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const workspace = await getEditorialWorkspace(await headers());
  if (!workspace) notFound();

  const { id } = await params;
  let entry: EditorialAdminEntry;
  try {
    entry = await workspace.repository.getEntry(id);
  } catch {
    notFound();
  }

  const controls = transitionControls[entry.status].filter((control) =>
    canPerformEditorialAction(workspace.actor, control.action),
  );

  return (
    <EditorialShell>
      <main className="editorial-admin-shell editorial-review-shell">
        <header className="editorial-admin-header editorial-review-header">
          <span className="eyebrow">Editorial review</span>
          <Link className="editorial-admin-back" href="/editorial">← Back to queue</Link>
          <h1>{entry.title}</h1>
          <p>{statusCopy[entry.status]}</p>
          <div className="editorial-review-meta">
            <span className="editorial-admin-status">{statusLabel(entry.status)}</span>
            <span>Last saved {formatDate(entry.updatedAt)}</span>
            <span>Series: {entry.series}</span>
          </div>
          {entry.status === "draft" || entry.status === "published" ? <Link className="editorial-admin-button editorial-review-edit-button" href={`/editorial/${entry.id}/edit`}>{entry.status === "published" ? "Edit article" : "Edit draft"}</Link> : null}
        </header>

        <section className="editorial-review-section" aria-labelledby="article-copy-heading">
          <div className="editorial-review-section-heading">
            <span className="eyebrow">Saved copy</span>
            <h2 id="article-copy-heading">Article preview</h2>
          </div>
          <p className="editorial-review-summary">{entry.summary}</p>
          <ArticleBody body={entry.body} />
        </section>

        <section className="editorial-review-section editorial-review-details" aria-labelledby="publication-details-heading">
          <div className="editorial-review-section-heading">
            <span className="eyebrow">Publishing details</span>
            <h2 id="publication-details-heading">Search and source settings</h2>
          </div>
          <dl className="editorial-review-definition-list">
            <div><dt>Search-result title</dt><dd>{entry.seoTitle}</dd></div>
            <div><dt>Search-result description</dt><dd>{entry.seoDescription}</dd></div>
            <div><dt>Original source</dt><dd>{canonicalLabel(entry)}</dd></div>
            <div><dt>Article URL</dt><dd>/security-signals/{entry.slug}</dd></div>
          </dl>
        </section>

        <section className="editorial-review-section editorial-review-decision" aria-labelledby="publishing-decision-heading">
          <div className="editorial-review-section-heading">
            <span className="eyebrow">Publishing decision</span>
            <h2 id="publishing-decision-heading">What happens next</h2>
          </div>
          <p>{entry.status === "published" ? "This article is live on the public site. Save edits from the editor to update the live version, or retire it to remove it from public listings." : "Review the copy and search settings, then publish directly to the public RBS article feed when it is ready. You can edit and republish it later if needed."}</p>
          {controls.length ? (
            <div className="editorial-review-actions">
              {controls.map((control) => (
                <form action={transitionEditorialEntry} key={control.nextStatus}>
                  <input name="id" type="hidden" value={entry.id} />
                  <input name="expectedVersion" type="hidden" value={entry.version} />
                  <input name="nextStatus" type="hidden" value={control.nextStatus} />
                  <button className={control.nextStatus === "draft" || control.nextStatus === "retired" ? "editorial-admin-button editorial-admin-button-secondary" : "editorial-admin-button"} type="submit">
                    {control.label}
                  </button>
                </form>
              ))}
            </div>
          ) : <p className="editorial-admin-empty">No further workflow actions are available for this article.</p>}
        </section>
      </main>
    </EditorialShell>
  );
}

function ArticleBody({ body }: { body: string }) {
  const blocks = body.replace(/\r\n?/gu, "\n").trim().split(/\n{2,}/);
  return (
    <article className="editorial-review-body">
      {blocks.map((block, index) => {
        const lines = block.split("\n").map(unescapeMarkdownPunctuation);
        const firstLine = lines[0] ?? "";
        const secondLine = lines[1] ?? "";
        if (/^=+\s*$/u.test(secondLine) || /^-+\s*$/u.test(secondLine)) return <h2 key={index}>{inlineMarkdown(firstLine)}</h2>;
        if (firstLine.startsWith("### ")) return <h3 key={index}>{inlineMarkdown(firstLine.slice(4))}</h3>;
        if (firstLine.startsWith("## ")) return <h2 key={index}>{inlineMarkdown(firstLine.slice(3))}</h2>;
        if (lines.every((line) => line.startsWith("- "))) {
          return <ul key={index}>{lines.map((line) => <li key={line}>{inlineMarkdown(line.slice(2))}</li>)}</ul>;
        }
        return <p key={index}>{inlineMarkdown(block)}</p>;
      })}
    </article>
  );
}

function inlineMarkdown(value: string): ReactNode {
  const matcher = /(\[[^\]]+\]\(https:\/\/[^\s)]+\)|\*\*[^*]+\*\*|\+\+[^+]+\+\+|\*[^*]+\*|_[^_]+_)/gu;
  const parts = unescapeMarkdownPunctuation(value).split(matcher).filter(Boolean);
  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/u);
    if (link) return <a href={link[2]} key={index} rel="noreferrer" target="_blank">{link[1]}</a>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("++") && part.endsWith("++")) return <u key={index}>{part.slice(2, -2)}</u>;
    if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_"))) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function unescapeMarkdownPunctuation(value: string): string {
  return value
    .replaceAll("\\-", "-")
    .replaceAll("\\[", "[")
    .replaceAll("\\]", "]")
    .replaceAll("\\*", "*")
    .replaceAll("\\_", "_")
    .replaceAll("\\+", "+");
}

function canonicalLabel(entry: EditorialAdminEntry): string {
  if (entry.canonicalMode === "local") return "This RBS article is the original source.";
  if (entry.canonicalMode === "external") return entry.canonicalUrl ?? "External original source";
  return "Original source still needs an owner decision.";
}

function statusLabel(status: EditorialStatus): string {
  return status === "scheduled" ? "approved" : status.replace("_", " ");
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}
