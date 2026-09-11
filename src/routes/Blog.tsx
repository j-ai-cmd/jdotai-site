import PostCards from '@/components/PostCards'
import { FadeUp } from '@/components/amicro/fade-up'
import { FigureReveal } from '@/components/amicro/figure-reveal'
import { TextReveal } from '@/components/amicro/text-reveal'
import { BrandCategoryTreemap } from '@/components/mono-charts/BrandCategoryTreemap'
import { BrandMonthlySparkline } from '@/components/mono-charts/BrandMonthlySparkline'
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
          <TextReveal as="h1" text="Notes on AI, automation, and where the hours go." />
        </div>
      </section>

      <div className="essay">
        <FadeUp>
          <p className="lede">
            {posts.length} posts, written as we build — not a content calendar working backward
            from keywords.
          </p>
        </FadeUp>

        <FigureReveal>
          <div className="figure chart-pair">
            <BrandMonthlySparkline posts={posts} />
            <BrandCategoryTreemap posts={posts} />
          </div>
        </FigureReveal>

        <PostCards posts={posts} />
      </div>
    </main>
  )
}
