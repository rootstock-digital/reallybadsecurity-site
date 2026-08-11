# Rootstock platform baseline

**Client project:** Really Bad Security
**Client-facing workspace:** Really Bad Security Workspace
**Platform source:** Rootstock Starter
**Platform release:** Current unreleased Workspace promotion; record the exact Starter release and source commit before the next production baseline.

## Adopted platform capabilities

- Next.js / OpenNext / Cloudflare deployment conventions
- Protected editorial administration foundation
- Starter Editorial Administration contract and lifecycle policy
- Reusable Workspace shell and module registry
- Client-specific editorial content and RBS commerce configuration

## Client-owned behavior

- RBS branding, public content, editorial fields, and publishing policy
- Cloudflare Access team and D1 binding configuration
- Shopify catalog, checkout, pricing, and fulfillment
- Printful product and mockup configuration
- RBS-specific Workspace module labels and business rules

## Module inventory

| Module | State | Notes |
| --- | --- | --- |
| Editorial | Available | Existing protected article workflow at `/editorial`. |
| Goods | Draft-only | Vibe Codes Only workflow is available to authorized workspace roles; provider writes are not enabled. |
| CMS | Planned | No general CMS is enabled. |

## Promotion record

Reusable Workspace contracts and presentation were promoted into Rootstock Starter under `src/modules/workspace`. RBS-specific Access/JWT verification, D1 membership, editorial policy, and branding remain in this repository.

The Starter Editorial Administration contract is promoted under `src/modules/editorial-admin`. RBS now exposes Starter-compatible actor, role, action, repository, and edit-policy names locally while retaining a compatibility layer for existing RBS-specific fields and D1 code.

Before applying a future Starter release, review the migration notes, update this baseline with the exact source release and commit, run the client verification suite, and record any client-specific compatibility decision.
