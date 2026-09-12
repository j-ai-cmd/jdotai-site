import { lazy, Suspense, useEffect, useRef } from 'react'

/** The instrument grid.
 *
 *  These are the real Mono Charts — MonoRounded* — not the hand-written
 *  Brand* tiles that used to stand in for them. They draw in #09090B /
 *  #71717A / #A1A1AA / #F4F4F5, which is the same scale tokens.css is built
 *  on, so nothing here is being themed to match the page.
 *
 *  Every one of them ships with its own sample data. That is the honest
 *  framing for this section and the page says so: it is the shape of the
 *  dashboard, drawn on sample figures, not a claim about anybody's matters.
 *
 *  They pull in Recharts, so the whole grid is a lazy chunk.
 */
const Area = lazy(() => import('@/components/mono-charts/MonoRoundedAreaChart').then(m => ({ default: m.MonoRoundedAreaChart })))
const Bar = lazy(() => import('@/components/mono-charts/MonoRoundedBarChart').then(m => ({ default: m.MonoRoundedBarChart })))
const Heat = lazy(() => import('@/components/mono-charts/MonoActivityHeatmap').then(m => ({ default: m.MonoActivityHeatmap })))
const Spark = lazy(() => import('@/components/mono-charts/MonoRoundedSparklineChart').then(m => ({ default: m.MonoRoundedSparklineChart })))
const Donut = lazy(() => import('@/components/mono-charts/MonoRoundedDonutChart').then(m => ({ default: m.MonoRoundedDonutChart })))
const Funnel = lazy(() => import('@/components/mono-charts/MonoRoundedFunnelChart').then(m => ({ default: m.MonoRoundedFunnelChart })))

const Panel = ({
  title, meta, className, children,
}: { title: string; meta: string; className: string; children: React.ReactNode }) => {
  const chart = useRef<HTMLDivElement>(null)

  // The panel carries the accessible name, so every <svg> Recharts draws
  // inside it is decoration and must not be announced separately. The charts
  // are third-party, so the attribute is set after they mount.
  useEffect(() => {
    const host = chart.current
    if (!host) return
    const mark = () => host.querySelectorAll('svg').forEach((s) => s.setAttribute('aria-hidden', 'true'))
    mark()
    const mo = new MutationObserver(mark)
    mo.observe(host, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [])

  return (
  <div className={className} data-rise>
    <div className="rig__head">
      <h4>{title}</h4>
      <span className="rig__n">{meta}</span>
    </div>
    {/* The charts render bare <svg>; the panel carries the accessible name
        so the grid is not ten unlabelled graphics. */}
    <div className="rig__chart" ref={chart} role="img" aria-label={`${title} — ${meta}, sample data`}>
      {children}
    </div>
  </div>
  )
}

export default function Rig() {
  return (
    <Suspense fallback={<div className="rig" style={{ minHeight: '34rem' }} aria-hidden="true" />}>
      <div className="rig">
        <Panel title="Intake volume" meta="12 wk" className="rig__wide">
          <Area theme="light" compact />
        </Panel>
        <Panel title="By matter type" meta="share" className="rig__third">
          <Donut theme="light" compact />
        </Panel>
        <Panel title="Time to first response" meta="hrs" className="rig__third">
          <Spark theme="light" compact />
        </Panel>
        <Panel title="Fields completed" meta="per form" className="rig__third">
          <Bar theme="light" compact />
        </Panel>
        <Panel title="Drop-off" meta="stage" className="rig__third">
          <Funnel theme="light" compact />
        </Panel>
        <Panel title="Submission activity" meta="rolling year" className="rig__half">
          <Heat theme="light" compact />
        </Panel>
      </div>
    </Suspense>
  )
}
