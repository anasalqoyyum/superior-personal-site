# Repository Guidelines

## Project Structure & Module Organization

This repository is an Astro site managed with pnpm. App routes live in `src/pages/`, shared UI in `src/components/`, and page shells in `src/layouts/`. Blog and compendium content live in `src/content/`, with language-specific blog posts under `src/content/blog/en/` and `src/content/blog/id/`. Global styles are in `src/styles/`, helper code in `src/utils.ts` and `src/scripts/`, and static assets in `public/`. Local images imported by Astro belong in `src/assets/`.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: start the local Astro dev server.
- `pnpm build`: create the production site in `dist/`.
- `pnpm preview`: preview the built site locally.
- `pnpm format`: apply oxfmt formatting across supported files.
- `pnpm format:check`: check formatting without writing files.
- `pnpm lint`: run Oxlint correctness checks.
- `pnpm lint:fix`: apply safe Oxlint fixes.
- `pnpm check`: run Oxlint, Astro diagnostics, and TypeScript checks.
- `pnpm test`: run the Node.js unit tests.

## Coding Style & Naming Conventions

Use `.oxfmtrc.json` as the formatting source of truth and `.oxlintrc.json` for lint rules. Name Astro components in PascalCase, such as `BaseHead.astro`; utility files and route slugs should stay lowercase or kebab-case. Keep blog filenames descriptive and kebab-case, for example `making-frontend-testing-effective.md`.

## Testing Guidelines

Before opening a PR, run `pnpm check`, `pnpm test`, `pnpm format:check`, and `pnpm build`, then smoke-test the affected pages with `pnpm dev`. Oxlint checks Astro frontmatter and script blocks but does not lint templates; keep Astro diagnostics in the check workflow. For content changes, verify the generated route, metadata, and any referenced images or links.

## Commit & Pull Request Guidelines

Recent history uses short, imperative Conventional Commit-style subjects such as `feat(content): add retro 2025`, `chore: adjust a bit on about and doing-things.md`, and `deployment: add wrangler`. Follow that pattern with prefixes like `feat`, `chore`, `style`, or `deployment`, adding a scope when useful. PRs should include a concise summary, note any route or content impact, link related issues when available, and attach screenshots for visible UI changes.

## Deployment & Configuration

Site configuration lives in `astro.config.mjs`, and Cloudflare deployment settings live in `wrangler.jsonc`. Do not edit generated output in `dist/`; rebuild it from source instead.
