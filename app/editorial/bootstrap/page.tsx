import type { Metadata } from "next";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import EditorialShell from "../../components/EditorialShell";
import { getAccessConfig, getVerifiedEditorialIdentity } from "../../modules/editorial-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Editorial access bootstrap",
  robots: { index: false, follow: false },
};

export default async function EditorialBootstrapPage() {
  const context = await getCloudflareContext({ async: true });
  const requestHeaders = await headers();
  const config = getAccessConfig(context.env);
  const identity = await getVerifiedEditorialIdentity(requestHeaders, config);
  if (!identity) notFound();

  return (
    <EditorialShell>
      <main className="editorial-admin-shell">
        <header className="editorial-admin-header">
          <span className="eyebrow">Access verified</span>
          <h1>Register this editor.</h1>
          <p>
            Cloudflare has verified your identity. This immutable identifier is used only to assign your editorial role.
          </p>
        </header>

        <dl className="editorial-admin-identity">
          <div>
            <dt>Access subject</dt>
            <dd><code>{identity.subject}</code></dd>
          </div>
          {identity.email ? (
            <div>
              <dt>Email</dt>
              <dd>{identity.email}</dd>
            </div>
          ) : null}
        </dl>
      </main>
    </EditorialShell>
  );
}
