# Superior-Personal-Site

Migrating (Remake of Remake) my old Personal Website and build it with Astro 🚀

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
