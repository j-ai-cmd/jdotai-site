import { lazy } from 'react'

/** One place that knows how to load each split route.
 *
 *  The importers are exported alongside the lazy components so the prerenderer
 *  can await them before it renders. React.lazy resolves asynchronously, and
 *  renderToString is synchronous — without warming these first, every split
 *  route prerenders its Suspense fallback instead of its content, which on a
 *  site with 30 SEO posts is worse than not prerendering at all.
 */
export const importers = {
  Legal: () => import('./Legal'),
  Blog: () => import('./Blog'),
  Post: () => import('./Post'),
  Contact: () => import('./Contact'),
  NotFound: () => import('./NotFound'),
} as const

export const Legal = lazy(importers.Legal)
export const Blog = lazy(importers.Blog)
export const Post = lazy(importers.Post)
export const Contact = lazy(importers.Contact)
export const NotFound = lazy(importers.NotFound)

/** Resolve every split chunk. Awaiting this flips each lazy payload to its
 *  resolved state, after which renderToString can walk them synchronously. */
export async function warmRoutes() {
  await Promise.all(Object.values(importers).map((load) => load()))
}
