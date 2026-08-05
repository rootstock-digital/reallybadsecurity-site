import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import EditorialShell from "../../../components/EditorialShell";
import { getEditorialWorkspace, type EditorialAdminEntry } from "../../../modules/editorial-admin";
import EditorialDraftForm from "../../EditorialDraftForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit article", robots: { index: false, follow: false } };

export default async function EditEditorialArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const workspace = await getEditorialWorkspace(await headers());
  if (!workspace) notFound();

  const { id } = await params;
  let entry: EditorialAdminEntry;
  try {
    entry = await workspace.repository.getEntry(id);
  } catch {
    notFound();
  }
  if (entry.status !== "draft") notFound();

  return (
    <EditorialShell>
      <main className="editorial-admin-shell">
        <header className="editorial-admin-header">
          <span className="eyebrow">Editorial workspace</span>
          <h1>Edit draft</h1>
          <p>Make changes, save the private draft, then send it back to review when it is ready.</p>
        </header>
        <EditorialDraftForm entry={entry} />
      </main>
    </EditorialShell>
  );
}
