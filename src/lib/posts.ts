import meta from '@/content/posts.json'

export type Post = {
  slug: string
  title: string
  pageTitle: string
  description: string
  published: boolean
  date: string
  category: string
  excerpt: string
}

/** Article bodies are the extracted <main> of each static page, pulled in
 *  eagerly as raw HTML strings. They are our own build output, not user input,
 *  which is what makes dangerouslySetInnerHTML acceptable here. */
// glob patterns are resolved by Vite at build time and must stay relative —
// the `@` alias is not applied to them.
const bodies = import.meta.glob('../content/posts/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const bySlug = new Map<string, string>(
  Object.entries(bodies).map(([path, html]) => [
    path.split('/').pop()!.replace(/\.html$/, ''),
    html,
  ]),
)

export const posts = (meta as Post[])
  .slice()
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

export const getPost = (slug: string) => posts.find((p) => p.slug === slug)
export const getBody = (slug: string) => bySlug.get(slug)
export const slugs = () => posts.map((p) => p.slug)
