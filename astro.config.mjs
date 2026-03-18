// @ts-check
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
// import rehypeSlug from 'rehype-slug'
// import rehypeAutoLinkHeadings from 'rehype-autolink-headings'
// import rehypeCodeTitle from 'rehype-code-titles'
// import rehypePrism from 'rehype-prism'

// https://astro.build/config
export default defineConfig({
  site: 'https://anasalqoyyum.dev',
  integrations: [mdx(), sitemap(), react()],
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    rehypePlugins: []
  }
})
