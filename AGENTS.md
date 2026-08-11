<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Rootstock AI Development Workflow

- Keep each task scoped to one reviewable outcome.
- Inspect only the files and repositories required for that outcome.
- Prefer targeted checks while iterating and run the complete required verification before completion.
- Keep progress updates and final summaries concise.
- Do not use subagents or parallel execution unless explicitly requested for a suitable task.
- Use the configured Rootstock default and the lowest sufficient reasoning for routine work.
- Recommend escalation using the canonical Rootstock workflow when architecture, security, ambiguity, or difficult debugging warrants more depth.
- Do not silently expand scope or claim to change the underlying model.
