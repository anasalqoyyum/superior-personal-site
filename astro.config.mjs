// @ts-check
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://anasalqoyyum.dev',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'ayu-dark',
      wrap: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
