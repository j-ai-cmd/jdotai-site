import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART } from './brand'

/** PLACEHOLDER DATA — not a measured result.
 *
 *  Every other figure on this site is a true count: five practice management
 *  systems, three assistants, two weeks, twenty-four hours. This series is
 *  not. It is shape-only, supplied at the user's request so the section can
 *  be laid out before real engagement data exists, and it is labelled as
 *  placeholder in the UI so no reader can mistake it for a claim.
 *
 *  Replace WEEKS with real numbers and delete the flag in Home.tsx. Until
 *  then this must never be screenshotted into a deck or a proposal.
 */
const WEEKS = [
  { week: 'Wk 1', manual: 38, donna: 0 },
  { week: 'Wk 2', manual: 36, donna: 2 },
  { week: 'Wk 3', manual: 30, donna: 8 },
  { week: 'Wk 4', manual: 24, donna: 14 },
  { week: 'Wk 5', manual: 17, donna: 21 },
  { week: 'Wk 6', manual: 11, donna: 27 },
  { week: 'Wk 7', manual: 8, donna: 30 },
  { week: 'Wk 8', manual: 6, donna: 32 },
]

export function BrandHoursArea() {
  return (
    <figure className="mono-chart">
      <div
        className="mono-chart__plot"
        role="img"
        aria-label="Illustrative shape only: hours handled by hand falling as hours handled by donna rise across eight weeks."
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={WEEKS} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="brand-hours-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART.ink} stopOpacity={0.22} />
                <stop offset="100%" stopColor={CHART.ink} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={CHART.rule} vertical={false} />
            <XAxis
              dataKey="week" tickLine={false} axisLine={false}
              tick={{ fontSize: 11, fill: CHART.muted }}
            />
            <YAxis
              tickLine={false} axisLine={false} width={40}
              tick={{ fontSize: 11, fill: CHART.muted }}
            />
            <Tooltip
              cursor={{ stroke: CHART.rule }}
              contentStyle={{
                background: CHART.paper, border: `1px solid ${CHART.ink}`,
                borderRadius: 0, fontSize: 12, color: CHART.ink,
              }}
            />
            <Area
              type="monotone" dataKey="manual" name="By hand"
              stroke={CHART.ink} strokeWidth={2} fill="url(#brand-hours-fill)"
            />
            <Area
              type="monotone" dataKey="donna" name="By donna"
              stroke={CHART.wine} strokeWidth={1.5} strokeDasharray="4 3" fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <figcaption>
        Hours handled by hand against hours handled by donna, across an eight-week
        rollout. Illustrative shape, not a measured result.
      </figcaption>
    </figure>
  )
}
