// @ts-check
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://anasalqoyyum.dev',
  integrations: [mdx(), sitemap(), react()],
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    rehypePlugins: ['rehype-slug', 'rehype-autolink-headings', 'rehype-code-titles', 'rehype-prism']
  }
})
