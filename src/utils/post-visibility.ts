import type { CollectionEntry } from 'astro:content'

type PostVisibility = Pick<
  CollectionEntry<'blog'>['data'],
  'hidden' | 'listAfter'
>

export function isPostListed({
  hidden = false,
  listAfter,
  now = Date.now()
}: PostVisibility & { now?: number }): boolean {
  return !hidden && (!listAfter || Date.parse(listAfter) <= now)
}
