# Rootstock Workspace foundation

**Status:** implemented foundation; external Access/D1 configuration remains environment-specific and unconfigured in this repository.

## Boundary

`/workspace` is the secure operating surface for RBS, branded in the UI as **Really Bad Security Workspace**. It is a client implementation of the reusable Workspace module now promoted into Rootstock Starter. Rootstock Digital is the platform owner, not the client-facing workspace name.

The Workspace owns:

- protected navigation and module discovery;
- client-neutral workspace identity display;
- module availability states;
- a shared location for future editorial, Goods, CMS, media, and integration workflows.

It does not own authentication, product data, prices, fulfillment, or public content. Those remain behind the existing editorial authorization boundary or the relevant provider.

## RBS implementation

The route calls `getEditorialWorkspace()` before rendering. That function verifies the Cloudflare Access JWT, resolves the member by immutable subject, and returns the application role. If the Access/D1 configuration or membership is absent, the route is not rendered.

The initial module registry is deliberately small:

- **Editorial:** available at `/workspace/editorial` and backed by the existing revisioned workflow; `/editorial` remains a compatibility route for the current article screens.
- **Goods:** available to authorized workspace roles at `/workspace/goods`; the Vibe Codes Only workflow now persists in D1 with normalized assets, approval gates, optimistic version checks, and an append-only audit trail. Shopify and Printful writes remain disabled.
- **CMS:** planned; no general CMS is being built yet.

## Starter promotion

Rootstock Starter receives only the reusable contracts and presentation layer under `src/modules/workspace`. A client must supply:

- a trusted server-side authentication provider;
- authorization and role policy;
- the protected route;
- client-specific module configuration; and
- durable providers for content, media, integrations, and audit records.

This keeps the Starter module reusable without hard-coding Cloudflare Access, Shopify, Printful, RBS terminology, or a client’s content model.

## Security posture

- MFA remains an identity-provider concern; the app does not introduce a second password system.
- Authentication and authorization remain separate decisions.
- The UI is never the authorization boundary; server routes and mutations must recheck access.
- Planned modules are not linked to write-capable routes.
- External systems remain canonical; the Workspace stores workflow state and references rather than cloning their entire data models.
- Goods mutations recheck the verified actor server-side, restrict writes to publisher/admin roles, and reject stale form versions before recording an audit event.
- The Goods module has automated policy and repository tests covering role denial, transition rules, required publication gates, stale-version rejection, valid version increments, and audit creation.
- The initial Shopify adapter is plan-first and draft-only; it requires a separate Admin token and `write_products` scope, and remains unexposed until provider idempotency and durable external references are implemented.
