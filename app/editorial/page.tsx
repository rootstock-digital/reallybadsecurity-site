import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import EditorialShell from "../components/EditorialShell";
import { getEditorialWorkspace } from "../modules/editorial-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Editorial workspace",
  robots: { index: false, follow: false },
};

export default async function EditorialWorkspacePage() {
  const workspace = await getEditorialWorkspace(await headers());
  if (!workspace) notFound();
  const entries = await workspace.repository.listEntries();

  return (
    <EditorialShell>
      <main className="editorial-admin-shell">
        <header className="editorial-admin-header">
          <span className="eyebrow">Editorial workspace</span>
          <h1>Build the signal.</h1>
          <p>Drafts remain private until the review and publication workflow is complete.</p>
          <div className="editorial-admin-actions">
            <span>Signed in as {workspace.actor.displayName ?? workspace.actor.email ?? "editor"}</span>
            <Link className="editorial-admin-button" href="/editorial/new">New article</Link>
          </div>
        </header>

        <section aria-labelledby="editorial-entry-list">
          <h2 id="editorial-entry-list">Your editorial queue</h2>
          {entries.length ? (
            <ol className="editorial-admin-list">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <div>
                    <Link className="editorial-admin-entry-link" href={`/editorial/${entry.id}`}>
                      <strong>{entry.title}</strong>
                      <span>/{entry.slug}</span>
                    </Link>
                  </div>
                  <span className="editorial-admin-status">{entry.status.replace("_", " ")}</span>
                </li>
              ))}
            </ol>
          ) : <p className="editorial-admin-empty">No drafts yet. Start with one useful thing worth saying clearly.</p>}
        </section>
      </main>
    </EditorialShell>
  );
}
