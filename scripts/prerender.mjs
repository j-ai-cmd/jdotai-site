/**
 * Prerender every route to real HTML.
 *
 * The static build this replaces shipped a complete page per URL. A plain SPA
 * would have handed crawlers an empty <div id="root">, which is a straight
 * regression on a site whose whole point is 30 SEO posts. So the build renders
 * each route with react-dom/server and writes it to disk; the client hydrates.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function head(meta) {
  const url = `https://jdotai.com${meta.path.endsWith('/') ? meta.path : `${meta.path}/`}`
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="${meta.ogType ?? 'website'}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
  ]
  if (meta.published) tags.push(`<meta property="article:published_time" content="${esc(meta.published)}">`)
  if (meta.jsonLd) {
    // </script> inside JSON would close the tag early.
    const json = JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')
    tags.push(`<script type="application/ld+json" data-seo-jsonld>${json}</script>`)
  }
  return tags.join('\n')
}

const { render, routeMeta, warmRoutes } = await import(pathToFileURL(join(dist, "server/entry-server.js")).href)

// Resolve every split chunk before the first render — see routes/registry.ts.
await warmRoutes()

// Awaiting the imports is necessary but not sufficient: React.lazy only flips
// a payload to Resolved on the render *after* it first suspends, so a route's
// very first render still returns the Suspense fallback. One discarded pass
// settles every payload; the second pass is the one we keep.
for (const meta of routeMeta) render(meta.path)

const template = await readFile(join(dist, 'index.html'), 'utf8')

let count = 0
for (const meta of routeMeta) {
  const html = render(meta.path)

  // A fallback here means an empty page for crawlers — fail the build loudly
  // rather than shipping 30 blank SEO posts.
  if (html.includes('route-wait')) {
    throw new Error(
      `Prerender produced a Suspense fallback for ${meta.path}. ` +
        `The route did not resolve before renderToString ran.`,
    )
  }

  let page = template
    // Strip the template's own head tags; each route writes its own.
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta name="description"[^>]*>\s*/, '')
    .replace(/<link rel="canonical"[^>]*>\s*/, '')
    .replace(/<meta property="og:[^"]*"[^>]*>\s*/g, '')
    .replace('</head>', `${head(meta)}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)

  const out = meta.path === '/404' ? join(dist, '404.html') : join(dist, meta.path, 'index.html')
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, page, 'utf8')
  count++
}

// The sitemap is generated from the same list the pages are, so the two can
// never drift. /404 is a real page but not a destination — it stays out.
const urls = routeMeta
  .filter((m) => m.path !== '/404')
  .map((m) => `  <url><loc>https://jdotai.com${m.path.endsWith('/') ? m.path : `${m.path}/`}</loc></url>`)
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
  'utf8',
)

// dist/server is build scaffolding, not output — nothing should deploy it.
await rm(join(dist, 'server'), { recursive: true, force: true })

console.log(`prerendered ${count} routes, sitemap: ${urls.length} urls`)
