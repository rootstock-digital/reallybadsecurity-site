import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { getEditorialWorkspace } from "../modules/editorial-admin";
import { WorkspaceShell, workspaceModules } from "../modules/workspace";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workspace",
  robots: { index: false, follow: false },
};

export default async function WorkspacePage() {
  const workspace = await getEditorialWorkspace(await headers());
  if (!workspace) notFound();
  const visibleModules = workspaceModules.filter((module) => !module.requiredRoles?.length || module.requiredRoles.some((role) => workspace.actor.roles.some((actorRole) => actorRole === role)));

  return (
    <WorkspaceShell actor={workspace.actor} modules={workspaceModules} name="Really Bad Security Workspace" contextLabel="Rootstock Digital workspace">
      <header className="workspace-page-header">
        <span className="eyebrow">Secure workspace</span>
        <h1>Make the next useful thing.</h1>
        <p>Editorial is ready. Goods and future CMS capabilities will be added as controlled, reviewable modules.</p>
      </header>

      <section className="workspace-module-grid" aria-labelledby="workspace-modules-heading">
        <div className="workspace-section-heading">
          <span className="label">Modules</span>
          <h2 id="workspace-modules-heading">Workspaces, not loose tools.</h2>
        </div>
        <div className="workspace-module-cards">
          {visibleModules.map((module) => (
            <article className={`workspace-module-card workspace-module-card-${module.status}`} key={module.id}>
              <div>
                <span className="workspace-module-status">{module.status === "available" ? "Available" : "Planned"}</span>
                <h3>{module.label}</h3>
                <p>{module.description}</p>
              </div>
              {module.status === "available" ? <a className="text-link" href={module.href}>Open module →</a> : <span className="workspace-module-note">Designed for the next phase</span>}
            </article>
          ))}
        </div>
      </section>
    </WorkspaceShell>
  );
}
