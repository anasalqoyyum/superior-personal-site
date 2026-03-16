# Repository Guidelines

## Project Structure & Module Organization

This repository is an Astro site managed with Bun. App routes live in `src/pages/`, shared UI in `src/components/`, and page shells in `src/layouts/`. Blog and compendium content live in `src/content/`, with language-specific blog posts under `src/content/blog/en/` and `src/content/blog/id/`. Global styles are in `src/styles/`, helper code in `src/utils.ts` and `src/scripts/`, and static assets in `public/`. Local images imported by Astro belong in `src/assets/`.

## Build, Test, and Development Commands

- `bun install`: install dependencies from `bun.lock`.
- `bun run dev`: start the local Astro dev server.
- `bun run build`: create the production site in `dist/`.
- `bun run preview`: preview the built site locally.
- `bun run format`: run Prettier across the repository.
- `bunx astro check`: run Astro and TypeScript checks for routes, props, and content collections.

## Coding Style & Naming Conventions

Use Prettier as the source of truth. The repo uses 2-space indentation, no semicolons, single quotes, trailing commas disabled, and `printWidth: 80`. Name Astro components in PascalCase, such as `BaseHead.astro`; utility files and route slugs should stay lowercase or kebab-case. Keep blog filenames descriptive and kebab-case, for example `making-frontend-testing-effective.md`.

## Testing Guidelines

There is no dedicated automated test suite yet. Before opening a PR, run `bunx astro check` and `bun run format`, then smoke-test the affected pages with `bun run dev`. For content changes, verify the generated route, metadata, and any referenced images or links.

## Commit & Pull Request Guidelines

Recent history uses short, imperative Conventional Commit-style subjects such as `feat(content): add retro 2025`, `chore: adjust a bit on about and doing-things.md`, and `deployment: add wrangler`. Follow that pattern with prefixes like `feat`, `chore`, `style`, or `deployment`, adding a scope when useful. PRs should include a concise summary, note any route or content impact, link related issues when available, and attach screenshots for visible UI changes.

## Deployment & Configuration

Site configuration lives in `astro.config.mjs`, and Cloudflare deployment settings live in `wrangler.jsonc`. Do not edit generated output in `dist/`; rebuild it from source instead.
