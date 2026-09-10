import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'
import { CHART } from './brand'

type Props = {
  value: number
  label: string
  /** Out of what the reader should picture this counting toward — never a
   *  number we invented. Omit when the count has no natural ceiling. */
  outOf?: number
}

/** The KPI-card shell from the mono-charts registry, rebuilt clean: real
 *  tokens instead of the registry's raw #181818/#FFFFFF, and no invented
 *  trendline. The registry's card ships a fabricated sparkline (revenue that
 *  doesn't exist); donna has four true counts and nothing to plot them
 *  against over time, so the ring plots the one honest thing available —
 *  the count itself, against the small whole number it names.
 */
export function BrandStatTile({ value, label, outOf }: Props) {
  const ring = outOf ? [{ v: (value / outOf) * 100 }] : [{ v: 100 }]

  return (
    <div className="stat-tile">
      <div className="stat-tile-ring" aria-hidden="true">
        <ResponsiveContainer width={72} height={72}>
          <RadialBarChart
            width={72}
            height={72}
            cx="50%"
            cy="50%"
            innerRadius={28}
            outerRadius={36}
            barSize={6}
            data={ring}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar
              dataKey="v"
              cornerRadius={3}
              fill={CHART.wine}
              background={{ fill: CHART.rule }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <span className="stat-tile-n">{value}</span>
      </div>
      <p className="stat-tile-caption">{label}</p>
    </div>
  )
}
