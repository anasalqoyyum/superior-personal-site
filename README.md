# Superior-Personal-Site

Migrating (Remake of Remake) my old Personal Website and build it with Astro 🚀

## Development

Use Node.js 22.23.4 or newer and pnpm 12.16.1, pinned in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm format:check
pnpm build
```

`pnpm check` runs Oxlint, Astro diagnostics, and the native TypeScript 7.0
compiler. `pnpm lint` runs Oxlint alone; `pnpm lint:fix` applies its safe fixes.
Oxlint checks JavaScript/TypeScript files and Astro frontmatter and script
blocks. It does not lint Astro templates. Keep `astro check` for component
diagnostics.

Astro's checker still needs the TypeScript 6 JavaScript API, so `typescript`
aliases Microsoft's `@typescript/typescript6` compatibility package while
`@typescript/native` supplies TypeScript 7's `tsc` executable. Keep both until
Astro supports checking components with a stable TypeScript 7 release.

`pnpm-workspace.yaml` overrides the selector parser pinned by
`@tailwindcss/typography` 0.5.20 to fix
[GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf).
Remove the override when the typography plugin uses a patched version.

`pnpm format` applies oxfmt formatting, including Astro files and Tailwind
class sorting. `.oxfmtrc.json` preserves the previous formatting options and
ignored paths, including MDX files. Astro formatting uses oxfmt's bundled
Prettier-based formatter and requires `@astrojs/compiler-rs` as a direct
development dependency. `.oxlintrc.json` enables correctness rules; formatting
options belong in `.oxfmtrc.json`.

`pnpm dev` starts the development server, and `pnpm preview` serves the
production build locally.

## Listing a post after a date

Add an optional `listAfter` timestamp to a post's frontmatter:

```yaml
listAfter: '2026-11-15T00:00:00+07:00'
```

The post appears in `/blog` and the home page's recent writing list from that
instant onward. Include a timezone offset, as above for midnight in Jakarta.
`publishedAt` still controls the displayed date and sorting. `hidden: true`
keeps a post out of both lists regardless of `listAfter`.

The site is static. JavaScript checks the visitor's clock when the page loads,
so these lists can reveal a post without a rebuild. Without JavaScript, they
reflect visibility at build time. The direct URL, RSS feed, and sitemap remain
available regardless of the listing date.
