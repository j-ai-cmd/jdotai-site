import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CHART } from './brand'

type Props = {
  value: number
  unit: string
  label: string
}

/** Adapted from the registry's MonoRoundedGaugeArc — same 240° arc-dial
 *  shape, reskinned to the three tokens. The registry's gauge fills to an
 *  arbitrary 84%; this one fills all the way, because "24 hours, every time"
 *  is a commitment donna makes on every enquiry, not a sampled average — a
 *  full ring is the honest reading, not an invented one.
 */
export function BrandGaugeRing({ value, unit, label }: Props) {
  const data = [{ v: 1 }]

  return (
    <div className="stat-tile stat-tile--gauge">
      <div className="stat-tile-ring stat-tile-ring--wide" aria-hidden="true">
        <ResponsiveContainer width={96} height={64}>
          <PieChart>
            <Pie
              data={data}
              dataKey="v"
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={38}
              outerRadius={48}
              cornerRadius={6}
            >
              <Cell fill={CHART.wine} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <span className="stat-tile-n stat-tile-n--gauge">{value}</span>
      </div>
      <p className="stat-tile-caption">
        {unit} <span className="stat-tile-caption-sub">{label}</span>
      </p>
    </div>
  )
}
