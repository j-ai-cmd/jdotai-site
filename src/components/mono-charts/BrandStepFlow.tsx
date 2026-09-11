type Step = { title: string; body: string }
type Props = { steps: Step[] }

/** Adapted from the registry's step-sequence grammar — numbered stages
 *  connected by a line — but carrying a real three-step process (what
 *  happens, in order) rather than a metric. Structural content, not a
 *  dataset, so there's no honesty question here the way there is with a
 *  chart of numbers: three real stages is the whole claim. */
export function BrandStepFlow({ steps }: Props) {
  return (
    <figure className="mono-chart mono-chart--flow">
      <ol className="step-flow">
        {steps.map((s, i) => (
          <li key={s.title} className="step-flow__step">
            <span className="step-flow__n">{i + 1}</span>
            <span className="step-flow__body">
              <b>{s.title}</b>
              {s.body}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  )
}
