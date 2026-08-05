Really Bad Security is a [Next.js](https://nextjs.org) application built with OpenNext and deployed to Cloudflare Workers.

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

Production deploys use:

```bash
npm run deploy
```

This deploys the OpenNext build to the configured production Cloudflare Worker. A staging configuration exists but is not operational until its Cloudflare dashboard prerequisites are complete; do not deploy unvalidated Shopify changes directly to production.

See [Infrastructure and releases](docs/infrastructure-and-releases.md) for bindings, secret handling, pre-release checks, and rollback expectations.
