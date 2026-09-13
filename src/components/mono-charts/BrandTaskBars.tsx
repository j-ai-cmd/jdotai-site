import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART } from './brand'

/** PLACEHOLDER DATA — not a measured result.
 *
 *  Same standing as BrandHoursArea: shape only, supplied so the section can
 *  be laid out before real engagement data exists, and flagged as
 *  illustrative in the UI. Replace TASKS with real figures and remove the
 *  flag in Home.tsx. Never screenshot this into a deck or a proposal.
 */
const TASKS = [
  { task: 'Intake and re-keying', hours: 12 },
  { task: 'Chasing documents', hours: 9 },
  { task: 'Matter admin', hours: 7 },
  { task: 'Reporting', hours: 6 },
  { task: 'Conflict checks', hours: 4 },
]

export function BrandTaskBars() {
  return (
    <figure className="mono-chart">
      <div
        className="mono-chart__plot"
        role="img"
        aria-label="Illustrative shape only: weekly hours done by hand, split by task."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={TASKS} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category" dataKey="task" width={132}
              tickLine={false} axisLine={false}
              tick={{ fontSize: 11, fill: CHART.wine }}
            />
            <Tooltip
              cursor={{ fill: CHART.sunk }}
              contentStyle={{
                background: CHART.paper, border: `1px solid ${CHART.ink}`,
                borderRadius: 0, fontSize: 12, color: CHART.ink,
              }}
            />
            <Bar dataKey="hours" name="Hours a week" barSize={13}>
              {TASKS.map((_, i) => (
                <Cell key={i} fill={i % 2 === 0 ? CHART.ink : CHART.wine} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption>
        Weekly hours done by hand, split by task. Illustrative shape, not a measured result.
      </figcaption>
    </figure>
  )
}
