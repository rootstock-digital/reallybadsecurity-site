import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import EditorialShell from "../../components/EditorialShell";
import { getEditorialWorkspace } from "../../modules/editorial-admin";
import EditorialDraftForm from "../EditorialDraftForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "New article", robots: { index: false, follow: false } };

export default async function NewEditorialArticlePage() {
  const workspace = await getEditorialWorkspace(await headers());
  if (!workspace) notFound();

  return (
    <EditorialShell>
      <main className="editorial-admin-shell">
        <header className="editorial-admin-header">
          <span className="eyebrow">Editorial workspace</span>
          <h1>New article</h1>
          <p>Write naturally with the toolbar. The article title is already the page headline, so use Heading for the first section.</p>
        </header>
        <EditorialDraftForm />
      </main>
    </EditorialShell>
  );
}
