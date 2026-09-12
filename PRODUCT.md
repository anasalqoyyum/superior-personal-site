# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: peers who arrive from a problem the author already solved. They are usually
searching, mid-task, and want the working answer plus the reasoning behind it.

Secondary: friends and the author's future self, who browse the site as a personal
record rather than a reference.

## Product Purpose

A personal website and writing archive for Anas Alqoyyum, a software engineer in
Jepara, Indonesia. It exists so the author can share what he builds and learns, and
so readers can find the solution to a problem he has already hit.

Success means posts that help a peer finish their task, and a record the author is
glad to have written.

## Positioning

One voice across topics that most personal sites split apart. Software engineering,
rhythm games, game and anime retrospectives, and personal notes share one archive
and one tone instead of becoming separate blogs or portfolios.

## Operating Context

- Astro site managed with pnpm, deployed to Cloudflare.
- Blog posts live in `src/content/blog/en/` and `src/content/blog/id/` as Markdown
  or MDX, with front matter validated by `src/content.config.ts`.
- Other surfaces: an about page, a media compendium, an Opus Magnum solutions
  gallery, and a photos-saver product page.
- `src/pages/stub.md` is a deliberate Markdown reference page, kept so the author
  can check how Markdown elements render.
- The compendium surface is currently unused and is not a priority.
- The author writes in Markdown, usually about his own projects and experiences.
- Verification is `pnpm astro check` and `pnpm format`; there is no automated test
  suite.

## Capabilities and Constraints

- Blog with English and Indonesian routes. English is the source of truth; an
  Indonesian translation is optional and happens when a post earns it.
- Content collections for blog posts and compendium entries.
- Static output. No comments, accounts, or user data are collected.
- No analytics claims or audience metrics exist, and none should be invented.

## Brand Commitments

- Name: Anas Alqoyyum.
- First-person, plain, practical voice. No marketing register.
- English is canonical for new writing; Indonesian is a translation, not a
  parallel source.

## Evidence on Hand

- Published posts in `src/content/blog/`, including first-hand engineering
  write-ups such as the FFXIV Pi plugin article.
- A CV link and social profiles in the about page and `src/consts.ts`.
- Side projects listed on the home page with real repository links.
- The Opus Magnum gallery and compendium hold real recorded results and media
  entries.
- Absent: testimonials, customer or employer endorsements, benchmarks, and
  audience numbers. Future work must not fabricate them.

## Product Principles

1. Write for the peer who is stuck: lead with the problem and the working answer.
2. Publish first-hand experience, not a restated generic tutorial.
3. English is the source of truth; translate a post only when it is worth it.
4. Keep the whole person in one archive; do not partition code, games, and life.
5. Prefer plain, first-person writing over polished marketing copy.
