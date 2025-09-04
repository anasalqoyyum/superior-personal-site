import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

export const PostFrontMatterSchema = z.object({
  title: z.string(),
  summary: z.string(),
  publishedAt: z.string(),
  thumbnail: z.string(),
  thumbnailAlt: z.string(),
  thumbnailSource: z.string(),
  lang: z.string().optional(),
  langInfo: z.string().optional(),
  isMultiLang: z.boolean().optional(),
  hidden: z.boolean().optional()
})

const blog = defineCollection({
  loader: glob({ base: './src/content/blog/', pattern: '**/*.{md,mdx}' }),
  schema: () => PostFrontMatterSchema
})

export const collections = { blog }
