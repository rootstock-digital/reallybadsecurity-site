# Rootstock Editorial Admin foundation

**Status:** code-only foundation. It is not deployed, configured, or reachable as an editor yet.

This is RBS's second client implementation candidate for a Rootstock Starter editorial-admin module. It separates public reading from protected authoring: public routes continue to read only published Markdown content, while the future workspace will read and write durable records in Cloudflare D1.

## Security boundary

- Cloudflare Access protects the editorial workspace path.
- The application validates `Cf-Access-Jwt-Assertion` against the Access team JWKS, issuer, and application audience. A forwarded email header alone is never an identity proof.
- D1 stores application roles by immutable Access subject. Roles are `writer`, `reviewer`, `publisher`, and `admin`; the Access policy answers **who may reach the workspace**, while D1 answers **what an authenticated person may do**.
- Every mutation rechecks identity, role, lifecycle transition, expected record version, and input shape on the server. The UI is not the authorization boundary.
- D1 uses prepared statements only. Article bodies are Markdown text, not executable MDX or HTML. Media will use R2 keys rather than database blobs.

## Editorial lifecycle

`draft → in_review → scheduled|published → retired`

Writers can create/update and submit drafts. Reviewers may approve reviewed work. Publishers and admins may publish or retire it. Each successful write creates a revision snapshot and an audit event. Updates use an expected version so a stale browser cannot silently overwrite newer work.

## Required Cloudflare configuration — intentionally not performed

1. Create a dedicated D1 database, e.g. `reallybadsecurity-editorial`.
2. Add the `EDITORIAL_DB` D1 binding and set its `migrations_dir` to `migrations` in `wrangler.jsonc` for production and staging.
3. Apply `migrations/0001_editorial_admin.sql` first to local D1, then staging. Review before any production migration.
4. Create a Cloudflare Access application restricted to the editorial path and a deliberately small allow policy.
5. Configure the Access team issuer and application audience as non-secret runtime settings. Validate the JWT in the app before resolving D1 membership; do not trust identity headers by themselves.
6. Seed the first `editorial_members` administrator only after the verified Access subject is known. Treat role changes as audited operational changes.

Do not point the workspace at production until its staging lifecycle, denied-access cases, lifecycle transitions, conflicts, audit records, and rollback runbook have been exercised.

## Medium distribution

Medium is an explicit, publisher-initiated destination. After local publication, the publisher may request a Medium **draft**, setting the RBS article URL as `canonicalUrl`. Store only destination status, returned ID/URL, and sanitized error state in `editorial_distribution_records`; store Medium credentials in Cloudflare secrets, never D1 or source control. The workflow must not auto-publish or background-sync content.
