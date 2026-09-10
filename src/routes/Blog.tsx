import PostCards from '@/components/PostCards'
import { posts } from '@/lib/posts'
import { useSeo } from '@/lib/seo'

const META = {
  title: 'Blogs — AI implementation for law firms | jdotai',
  description:
    'Notes on AI, automation, and how small firms actually get work off their plate.',
  path: '/blog',
} as const

export default function Blog() {
  useSeo(META)
  return (
    <main id="main">
      <section className="open">
        <div className="narrow">
          <h1>Blogs.</h1>
          <p className="lede">
            Notes on AI, automation, and how small firms actually get work off their plate.
          </p>
        </div>
      </section>
      <section className="sec">
        <div className="in wide">
          <PostCards posts={posts} all />
        </div>
      </section>
    </main>
  )
}
