import type { Post } from '@/lib/posts'

type Props = { posts: Post[] }

/** Adapted from the registry's MonoRoundedTreemapChart — same rounded-tile
 *  grammar, but the registry's four tiles (Storage/Compute/Network/Cache)
 *  are fabricated shares. This buckets the real `posts` array by category
 *  and sizes each tile by its actual count, so the treemap is never more
 *  than a differently-shaped version of the same true numbers. */
export function BrandCategoryTreemap({ posts }: Props) {
  const counts = new Map<string, number>()
  posts.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1))
  const tiles = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, n]) => ({ label, n, opacity: 0.35 + 0.65 * (n / Math.max(...counts.values())) }))

  return (
    <figure className="mono-chart mono-chart--treemap">
      <div className="treemap">
        {tiles.map((t) => (
          <div key={t.label} className="treemap__tile" style={{ opacity: t.opacity }}>
            <span className="treemap__name">{t.label}</span>
            <span className="treemap__n">{t.n}</span>
          </div>
        ))}
      </div>
      <figcaption>What {posts.length} posts are actually about, by category.</figcaption>
    </figure>
  )
}
