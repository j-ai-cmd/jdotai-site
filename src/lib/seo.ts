import { useEffect } from 'react'

export type Meta = {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article'
  published?: string
  jsonLd?: Record<string, unknown>
}

export const ORIGIN = 'https://jdotai.com'

export const canonical = (path: string) =>
  `${ORIGIN}${path.endsWith('/') ? path : `${path}/`}`

/** Client-side head sync. The prerender writes the same values into the static
 *  HTML, so this only matters for in-app navigation — but without it every
 *  route after the first would inherit the previous page's title. */
export function useSeo(meta: Meta) {
  useEffect(() => {
    document.title = meta.title

    const set = (sel: string, attr: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(sel)
      if (!el) {
        el = sel.startsWith('link')
          ? document.createElement('link')
          : document.createElement('meta')
        const m = sel.match(/\[(name|property|rel)="([^"]+)"\]/)
        if (m) el.setAttribute(m[1], m[2])
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    const url = canonical(meta.path)
    set('meta[name="description"]', 'content', meta.description)
    set('link[rel="canonical"]', 'href', url)
    set('meta[property="og:title"]', 'content', meta.title)
    set('meta[property="og:description"]', 'content', meta.description)
    set('meta[property="og:url"]', 'content', url)
    set('meta[property="og:type"]', 'content', meta.ogType ?? 'website')

    let ld = document.head.querySelector<HTMLScriptElement>('script[data-seo-jsonld]')
    if (meta.jsonLd) {
      if (!ld) {
        ld = document.createElement('script')
        ld.type = 'application/ld+json'
        ld.setAttribute('data-seo-jsonld', '')
        document.head.appendChild(ld)
      }
      ld.textContent = JSON.stringify(meta.jsonLd)
    } else if (ld) {
      ld.remove()
    }
  }, [meta])
}

export function articleJsonLd(p: {
  title: string
  description: string
  path: string
  published: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: p.description,
    datePublished: p.published,
    dateModified: p.published,
    author: { '@type': 'Person', name: 'Jai Dhingra', url: `${ORIGIN}/` },
    publisher: { '@type': 'Organization', name: 'jdotai', url: `${ORIGIN}/` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical(p.path) },
  }
}
