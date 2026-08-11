import type { WorkspaceModule } from "./workspace.types";

export const workspaceModules: readonly WorkspaceModule[] = [
  {
    id: "editorial",
    label: "Editorial",
    description: "Draft, review, and publish articles with an explicit approval trail.",
    href: "/workspace/editorial",
    status: "available",
  },
  {
    id: "goods",
    label: "Goods",
    description: "Upload artwork, build custom product mockups, approve them, and create Shopify drafts.",
    href: "/workspace/goods",
    status: "available",
    requiredRoles: ["admin", "publisher"],
  },
  {
    id: "cms",
    label: "CMS",
    description: "A future structured content layer for client-owned publishing workflows.",
    href: "/workspace/cms",
    status: "planned",
  },
];
