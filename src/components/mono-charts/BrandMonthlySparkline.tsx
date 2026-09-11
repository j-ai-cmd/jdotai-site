import { ResponsiveContainer, AreaChart, Area, XAxis } from 'recharts'
import type { Post } from '@/lib/posts'
import { CHART } from './brand'

type Props = { posts: Post[] }

/** Adapted from the registry's MonoRoundedSparklineChart — same rounded
 *  mini-area grammar, but the registry's rows are fabricated telemetry
 *  ("CPU Temp 42°C"). This one has nothing hardcoded: it buckets the real
 *  `posts` array by publish month, so the count only ever reflects what has
 *  actually shipped. */
export function BrandMonthlySparkline({ posts }: Props) {
  const byMonth = new Map<string, number>()
  posts.forEach((p) => {
    const key = p.date.slice(0, 7)
    byMonth.set(key, (byMonth.get(key) ?? 0) + 1)
  })
  const months = [...byMonth.keys()].sort()
  const data = months.map((m) => ({
    month: new Date(`${m}-01`).toLocaleDateString('en-AU', { month: 'short' }),
    n: byMonth.get(m)!,
  }))

  return (
    <figure className="mono-chart">
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: CHART.ink, fontFamily: 'Geist, system-ui, sans-serif' }}
          />
          <Area
            type="monotone"
            dataKey="n"
            stroke={CHART.wine}
            strokeWidth={2}
            strokeLinecap="round"
            fill={CHART.wine}
            fillOpacity={0.12}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <figcaption>
        {posts.length} posts published, {months.length} months running.
      </figcaption>
    </figure>
  )
}
