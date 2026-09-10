import { CHART } from './brand'

type Props = {
  weeks: number
  fromLabel: string
  toLabel: string
}

/** Adapted from the registry's MonoRoundedBulletChart — same bar-with-marker
 *  grammar, but plotting a real timeline (signing day to go-live day) rather
 *  than the registry's invented throughput/latency/uptime targets. The bar
 *  runs its full length because "weeks" isn't a percentage of some larger
 *  total — it's the whole distance from one real date to another.
 */
export function BrandBulletChart({ weeks, fromLabel, toLabel }: Props) {
  return (
    <div className="stat-tile stat-tile--bullet">
      <div className="stat-tile-bullet-head">
        <span className="stat-tile-n">{weeks}</span>
        <span className="stat-tile-unit">weeks</span>
      </div>
      <div className="stat-tile-bullet-track" aria-hidden="true">
        <div className="stat-tile-bullet-fill" style={{ background: CHART.wine }} />
      </div>
      <div className="stat-tile-bullet-ends">
        <span>{fromLabel}</span>
        <span>{toLabel}</span>
      </div>
    </div>
  )
}
