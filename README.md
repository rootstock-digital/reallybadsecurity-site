Really Bad Security is a [Next.js](https://nextjs.org) application built with OpenNext and deployed to Cloudflare Workers.

This repository is a client implementation of Rootstock Starter, not the platform source of truth. Reusable capabilities belong in Starter; RBS owns its branding, content, integrations, and client-specific business rules. The protected client-facing workspace is **Really Bad Security Workspace** at `/workspace`.

See [the platform baseline](docs/rootstock-platform-baseline.md) and [Workspace foundation](docs/workspace-foundation.md) before promoting or migrating platform functionality.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Build the application with:

```bash
npm run build
```

## Deployment

RBS has one routine release path:

```text
local development → committed main branch → GitHub Actions CI → production
```

Localhost is for development only. `main` is the source of truth, and production
is deployed only from a clean, pushed commit after the **Validate site** GitHub
Actions workflow passes. Shopify remains the source of truth for catalog and
checkout data.

After those conditions are met, deploy production with:

```bash
npm run deploy
```

This deploys the OpenNext build to the configured production Cloudflare Worker.
Staging is not part of the routine RBS release path and must never be used as a
second working copy of the site or with production Shopify credentials.

See [Infrastructure and releases](docs/infrastructure-and-releases.md) for the
release gate, bindings, secret handling, and rollback expectations.
