import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import type { Post } from '@/lib/posts'

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** A post is only linkable once its page exists. Unpublished entries render as
 *  plain items so the site never ships a link to a page that isn't there. */
export default function PostCards({ posts }: { posts: Post[] }) {
  return (
    <ul className="cards">
      {posts.map((p) => {
        const body = (
          <>
            {p.published && p.category && (
              <Badge variant="secondary" className="mb-2">{p.category}</Badge>
            )}
            <h3>{p.title}</h3>
            <p className="card-meta">
              {p.published ? formatDate(p.date) : 'Scheduled — ' + formatDate(p.date)}
            </p>
          </>
        )
        return (
          <li className={`card${p.published ? '' : ' card--scheduled'}`} key={p.slug}>
            {p.published ? (
              <Link className="card-in" to={`/blog/${p.slug}`}>{body}</Link>
            ) : (
              <div className="card-in">{body}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
