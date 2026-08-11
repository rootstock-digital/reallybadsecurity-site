export type WorkspaceModuleStatus = "available" | "planned";

export type WorkspaceModule = Readonly<{
  id: string;
  label: string;
  description: string;
  href: string;
  status: WorkspaceModuleStatus;
  requiredRoles?: readonly string[];
}>;

export type WorkspaceActor = Readonly<{
  displayName?: string;
  email?: string;
  roles: readonly string[];
}>;
