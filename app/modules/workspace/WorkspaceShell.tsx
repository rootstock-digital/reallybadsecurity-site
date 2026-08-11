import Link from "next/link";
import type { ReactNode } from "react";

import type { WorkspaceActor, WorkspaceModule } from "./workspace.types";

type WorkspaceShellProps = Readonly<{
  actor: WorkspaceActor;
  modules: readonly WorkspaceModule[];
  name: string;
  contextLabel: string;
  children: ReactNode;
}>;

export default function WorkspaceShell({ actor, modules, name, contextLabel, children }: WorkspaceShellProps) {
  const identity = actor.displayName ?? actor.email ?? "workspace member";

  return (
    <div className="workspace-shell">
      <a className="skip-link" href="#workspace-main">Skip to workspace content</a>
      <header className="workspace-header">
        <div className="workspace-header-inner container">
          <div>
            <Link className="workspace-brand" href="/workspace">{name}</Link>
            <span className="workspace-context">{contextLabel}</span>
          </div>
          <div className="workspace-identity">
            <span>{identity}</span>
            <span className="workspace-security-status">MFA protected</span>
          </div>
        </div>
      </header>
      <div className="workspace-body container">
        <aside className="workspace-sidebar" aria-label="Workspace modules">
          <nav>
            <Link className="workspace-nav-link workspace-nav-link-active" href="/workspace">Overview</Link>
            {modules.map((module) => module.status === "available" ? (
              <Link className="workspace-nav-link" href={module.href} key={module.id}>
                <span>{module.label}</span>
              </Link>
            ) : (
              <span className="workspace-nav-link workspace-nav-link-planned" key={module.id} aria-disabled="true">
                <span>{module.label}</span>
                <small>Planned</small>
              </span>
            ))}
          </nav>
        </aside>
        <main id="workspace-main" className="workspace-main">{children}</main>
      </div>
    </div>
  );
}
