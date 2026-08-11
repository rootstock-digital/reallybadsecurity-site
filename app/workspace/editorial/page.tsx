import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { getEditorialWorkspace } from "../../modules/editorial-admin";
import { WorkspaceShell, workspaceModules } from "../../modules/workspace";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Editorial",
  robots: { index: false, follow: false },
};

export default async function WorkspaceEditorialPage() {
  const workspace = await getEditorialWorkspace(await headers());
  if (!workspace) notFound();

  const entries = await workspace.repository.listEntries();

  return (
    <WorkspaceShell actor={workspace.actor} modules={workspaceModules} name="Really Bad Security Workspace" contextLabel="Rootstock Digital workspace">
      <header className="workspace-editorial-header">
        <div>
          <span className="eyebrow">Editorial module</span>
          <h1>Build the signal.</h1>
          <p>Drafts remain private until the review and publication workflow is complete.</p>
        </div>
        <Link className="workspace-action-button" href="/editorial/new">New article</Link>
      </header>

      <section className="workspace-editorial-queue" aria-labelledby="workspace-editorial-queue-heading">
        <div className="workspace-section-heading">
          <span className="label">Content operations</span>
          <h2 id="workspace-editorial-queue-heading">Editorial queue</h2>
        </div>
        {entries.length ? (
          <ol className="workspace-editorial-list">
            {entries.map((entry) => (
              <li key={entry.id}>
                <Link href={`/editorial/${entry.id}`}>
                  <strong>{entry.title}</strong>
                  <span>/{entry.slug}</span>
                </Link>
                <span className="workspace-editorial-status">{entry.status.replace("_", " ")}</span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="workspace-editorial-empty">
            <h3>No articles yet.</h3>
            <p>Start with one useful thing worth saying clearly.</p>
            <Link className="workspace-action-button" href="/editorial/new">Create the first article</Link>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}
