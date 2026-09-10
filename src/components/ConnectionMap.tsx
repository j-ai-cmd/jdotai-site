const PMS = ['Clio', 'Smokeball', 'Actionstep', 'myCase', 'LEAP']
const ASSISTANTS = ['Claude', 'ChatGPT', 'Kimi']

/** Hand-built inline SVG — Tier B on Hallmark's enrichment hierarchy, and the
 *  right tier here: this is a structural fact (what connects to what), not a
 *  dataset. A bar chart of "5 platforms" would be fake precision, and the
 *  repo's own rule is that no invented metric ships.
 *
 *  Every colour is a token. Nothing is measured in pixels the reader can see —
 *  the viewBox scales, the type does not.
 */
export default function ConnectionMap() {
  const W = 900
  const H = 320
  const leftX = 150
  const rightX = W - 150
  const midX = W / 2
  const midY = H / 2

  const row = (i: number, n: number) => {
    const span = H - 90
    return 45 + (span / (n - 1 || 1)) * i
  }

  return (
    <figure className="cmap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="cmap-title cmap-desc"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id="cmap-title">What donna connects</title>
        <desc id="cmap-desc">
          donna sits between five practice management systems — {PMS.join(', ')} — and three AI
          assistants — {ASSISTANTS.join(', ')}.
        </desc>

        {/* wires, drawn first so the labels sit over them */}
        <g className="cmap-wire">
          {PMS.map((_, i) => (
            <path
              key={`l${i}`}
              d={`M ${leftX + 8} ${row(i, PMS.length)} C ${midX - 90} ${row(i, PMS.length)}, ${midX - 90} ${midY}, ${midX - 46} ${midY}`}
            />
          ))}
          {ASSISTANTS.map((_, i) => (
            <path
              key={`r${i}`}
              d={`M ${rightX - 8} ${row(i, ASSISTANTS.length)} C ${midX + 90} ${row(i, ASSISTANTS.length)}, ${midX + 90} ${midY}, ${midX + 46} ${midY}`}
            />
          ))}
        </g>

        {PMS.map((name, i) => (
          <text key={name} className="cmap-node" x={leftX} y={row(i, PMS.length)} textAnchor="end" dominantBaseline="middle">
            {name}
          </text>
        ))}

        {ASSISTANTS.map((name, i) => (
          <text key={name} className="cmap-node" x={rightX} y={row(i, ASSISTANTS.length)} textAnchor="start" dominantBaseline="middle">
            {name}
          </text>
        ))}

        <g>
          <rect className="cmap-hub" x={midX - 46} y={midY - 22} width={92} height={44} rx={8} />
          <text className="cmap-hub-name" x={midX} y={midY} textAnchor="middle" dominantBaseline="middle">
            donna
          </text>
        </g>
      </svg>
      <figcaption>
        Five practice management systems, three assistants, one connector. Ask in the assistant you
        already use; donna answers from the system your firm already runs on.
      </figcaption>
    </figure>
  )
}
