import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { formatDate } from '@/components/PostCards'
import { getBody, getPost } from '@/lib/posts'
import { articleJsonLd, useSeo, type Meta } from '@/lib/seo'

const FALLBACK: Meta = {
  title: 'Blogs — AI implementation for law firms | jdotai',
  description: 'Notes on AI, automation, and how small firms actually get work off their plate.',
  path: '/blog',
}

export default function Post() {
  const { slug = '' } = useParams()
  const post = getPost(slug)
  const body = getBody(slug)

  // Built before any early return — hooks must run in the same order every
  // render, including the render where the slug doesn't resolve.
  const meta = useMemo<Meta>(() => {
    if (!post) return FALLBACK
    const path = `/blog/${post.slug}`
    return {
      title: post.pageTitle || `${post.title} | jdotai`,
      description: post.description,
      path,
      ogType: 'article',
      published: post.date,
      jsonLd: articleJsonLd({
        title: post.title,
        description: post.description,
        path,
        published: post.date,
      }),
    }
  }, [post])

  useSeo(meta)

  if (!post || !body) return <Navigate to="/blog" replace />

  return (
    <main id="main">
      {/* Extracted from the static build — our own content, not user input. */}
      <div className="wrap wrap--narrow prose band" dangerouslySetInnerHTML={{ __html: body }} />
      <section className="post-foot">
        <div className="wrap wrap--narrow">
          <p className="card-meta">
            {formatDate(post.date)}
            {post.category ? ` · ${post.category}` : ''}
          </p>
          <p><Link  to="/blog">&larr; All posts</Link></p>
        </div>
      </section>
    </main>
  )
}
