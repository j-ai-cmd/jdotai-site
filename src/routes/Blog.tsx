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
      <section className="hero">
        <div className="hero__in">
          <TextReveal as="h1" text="Notes on AI, automation, and where the hours go." />
          <FadeUp delay={0.15}>
            <div className="hero__dek">
              <p className="lede">
                {posts.length} posts, written as we build — not a content calendar working
                backward from keywords.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="section">
        <div className="section-in">
          <FigureReveal>
            <div className="chart-row">
              <BrandMonthlySparkline posts={posts} />
              <BrandCategoryTreemap posts={posts} />
            </div>
          </FigureReveal>
        </div>
      </section>

      {/* The index runs the full page width rather than the reading measure:
          four across only works when the grid has the whole page to sit in. */}
      <section className="section section--top" id="index">
        <div className="section-in">
          <PostCards posts={posts} />
        </div>
      </section>
    </main>
  )
}
