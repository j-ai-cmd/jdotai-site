/** The two margin arcs. Generated, not an asset; hidden below 64rem where
 *  there is no gutter to spare. Ported verbatim from the static build. */
const PATH = 'M200 0 C 60 180, 60 320, 130 500 C 200 680, 200 820, 60 1000'
const HAIR = 'M200 0 C 20 200, 20 300, 96 500 C 172 700, 172 800, 8 1000'

function Arc({ side }: { side: 'l' | 'r' }) {
  return (
    <svg className={side} aria-hidden="true" focusable="false" viewBox="0 0 200 1000" preserveAspectRatio="none">
      <path d={PATH} />
      <path className="hair" d={HAIR} />
    </svg>
  )
}

export default function Frame() {
  return (
    <div className="frame" aria-hidden="true">
      <Arc side="l" />
      <Arc side="r" />
    </div>
  )
}
