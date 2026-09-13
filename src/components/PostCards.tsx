import { Link } from 'react-router-dom'
import type { Post } from '@/lib/posts'

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** A post is only linkable once its page exists. Unpublished entries render as
 *  plain items so the site never ships a link to a page that isn't there.
 *
 *  The category sits in the same bordered uppercase frame the console's state
 *  column and the illustrative-data flag use, so the index reads as part of
 *  the same system rather than as a second card vocabulary. */
export default function PostCards({ posts }: { posts: Post[] }) {
  return (
    <ul className="cards">
      {posts.map((p) => {
        const body = (
          <>
            {p.published && p.category && (
              <span className="ucase card-cat">{p.category}</span>
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
