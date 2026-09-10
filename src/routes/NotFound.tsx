import { Link } from 'react-router-dom'
import { useSeo } from '@/lib/seo'

/** The old build answered every unknown path with 200 and the homepage shell.
 *  This is a real page, and the prerenderer writes it to 404.html so the host
 *  can serve it with the right status. */
export default function NotFound() {
  useSeo({
    title: 'Page not found — jdotai',
    description: 'That page does not exist.',
    path: '/404',
  })
  return (
    <main id="main">
      <section className="open">
        <div className="narrow">
          <h1>That page isn&rsquo;t here.</h1>
          <p className="lede">
            The link may be old, or the page may have moved. The work is all still on the site.
          </p>
          <div className="go">
            <Link className="btn" to="/">Home</Link>
            <Link className="btn btn--line" to="/blog">Read the blog</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
