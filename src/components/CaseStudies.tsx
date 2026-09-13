/** Seven automations, each built end to end on the practice management system
 *  the firm actually runs.
 *
 *  The firms are real and the work is real. The names are not: client
 *  identities are withheld, which is the ordinary position for legal work and
 *  is stated on every card rather than buried in a footnote. That is the
 *  difference between anonymising a real engagement and inventing one, and the
 *  redaction bar exists to keep it visible.
 *
 *  Figures carried over from the case file are marked illustrative where they
 *  were illustrative. Nothing here is presented as a measured average. */

type Study = {
  id: string
  title: string
  practice: string
  pms: string
  problem: string
  steps: string[]
  rail: string[]
}

const STUDIES: Study[] = [
  {
    id: 'C-01',
    title: 'Client intake agent',
    practice: 'Estate planning',
    pms: 'Smokeball',
    problem:
      'Intake meant chasing clients for documents over email, re-keying the same information into the practice management system by hand, and losing track of who was actually ready for a first meeting.',
    steps: [
      'Custom intake form for estate matters: wills, trusts, beneficiaries, asset inventory',
      'The client fills it at their own pace, and progress saves as they go',
      'Submission creates the matter directly in the practice management system, pre-filled',
      'The firm gets a live view of every submission and how complete it is',
    ],
    rail: ['Client fills form', 'Auto-saved', 'Matter created', 'Firm notified'],
  },
  {
    id: 'C-02',
    title: 'Deadline tracker',
    practice: 'Criminal law',
    pms: 'Clio',
    problem:
      'Court dates, filing deadlines and hearings lived in memory and scattered calendar entries. In criminal defence a missed filing deadline can cost a client their case.',
    steps: [
      'Reads every active matter once a day',
      'Pulls out every deadline, filing date and court date',
      'Syncs them to the calendar the firm already uses',
      'Flags anything added or changed since the last run',
    ],
    rail: ['Daily read', 'Deadlines extracted', 'Calendar synced', 'Changes flagged'],
  },
  {
    id: 'C-03',
    title: 'Pre-meeting brief',
    practice: 'Estate planning',
    pms: 'Smokeball',
    problem:
      'Attorneys walked into client meetings having skimmed the file minutes beforehand, and missed gaps in what the client had actually submitted.',
    steps: [
      'Reads the full matter, including every document the client submitted',
      'Cross-references it against the firm’s own standard process',
      'Writes a brief: what is missing client-side, what to raise on the call',
      'Delivered before the meeting, not after',
    ],
    rail: ['Matter read', 'Checked against process', 'Brief written', 'Sent ahead'],
  },
  {
    id: 'C-04',
    title: 'Practice system, connected to Claude',
    practice: 'Estate planning and real estate',
    pms: 'Smokeball',
    problem:
      'Getting a straight answer out of the practice management system meant clicking through matter after matter. Attorneys wanted to ask a question, not navigate a interface to find the answer.',
    steps: [
      'An MCP connector links the practice management system to Claude',
      'Attorneys ask in plain English inside their own Claude account',
      'The connector queries the system live and returns the answer',
      'Works across both firms’ instances',
    ],
    rail: ['Question asked', 'Connector queries', 'Answer returned'],
  },
  {
    id: 'C-05',
    title: 'Client re-engagement',
    practice: 'Real estate',
    pms: 'Smokeball',
    problem:
      'Closed matters simply sat there. Expired documents, lapsed policies, clients due a review: none of it surfaced until a client rang to ask why nobody had been in touch.',
    steps: [
      'Scans closed matters for expired documents and lapsed reviews',
      'Flags the clients whose file now warrants contact',
      'Drafts the outreach with the context pulled from the matter',
      'The attorney reads it and sends it',
    ],
    rail: ['Closed matters scanned', 'Client flagged', 'Draft written', 'Attorney sends'],
  },
  {
    id: 'C-06',
    title: 'Enquiry qualification and booking',
    practice: 'Real estate and estate planning',
    pms: 'Smokeball',
    problem:
      'Contact form submissions sat in an inbox until somebody had time to qualify them. By the time a lawyer followed up, the prospect had often already called someone else.',
    steps: [
      'The submission triggers the agent straight away',
      'Qualifies on practice area, matter type and urgency',
      'Sends a written reply with the relevant next step',
      'Offers a consultation slot with the right attorney',
    ],
    rail: ['Form submitted', 'Qualified', 'Reply sent', 'Consult booked'],
  },
  {
    id: 'C-07',
    title: 'Custom workflow automation',
    practice: 'All four firms',
    pms: 'Clio and Smokeball',
    problem:
      'Every firm ran the same multi-step process to open a matter, the same monthly billing routine eating a Friday afternoon, and a document checklist that lived in one person’s head.',
    steps: [
      'Undocumented weekly and monthly processes mapped step by step with each firm',
      'Automated against whichever system that firm runs',
      'Covers new-matter setup, billing preparation and document checklists',
      'Built and live within a week, per firm',
    ],
    rail: ['Process mapped', 'Automated', 'Live'],
  },
]

/** The rail: one ink line, ringed nodes, the last one filled. Drawn rather
 *  than imported so it inherits the page's own palette through currentColor. */
function Rail({ nodes }: { nodes: string[] }) {
  const w = 640
  const r = 15
  const mx = 30
  const step = nodes.length > 1 ? (w - mx * 2) / (nodes.length - 1) : 0
  const y = 26
  const lineH = 13
  const wrapped = nodes.map((label) => {
    const words = label.split(' ')
    const lines: string[] = []
    let cur = ''
    words.forEach((word) => {
      if (`${cur} ${word}`.trim().length > 14) { lines.push(cur.trim()); cur = word }
      else cur = `${cur} ${word}`.trim()
    })
    if (cur) lines.push(cur)
    return lines
  })
  const h = y + r + 14 + Math.max(...wrapped.map((l) => l.length)) * lineH

  return (
    <svg className="rail" viewBox={`0 0 ${w} ${h}`} role="img"
      aria-label={`Sequence: ${nodes.join(', then ')}.`}>
      <line x1={mx} y1={y} x2={w - mx} y2={y} className="rail__line" />
      {nodes.map((label, i) => {
        const cx = mx + i * step
        const last = i === nodes.length - 1
        return (
          <g key={label}>
            <circle cx={cx} cy={y} r={r} className={last ? 'rail__node rail__node--end' : 'rail__node'} />
            <text x={cx} y={y + 5} textAnchor="middle"
              className={last ? 'rail__n rail__n--end' : 'rail__n'}>{i + 1}</text>
            {wrapped[i].map((ln, li) => (
              <text key={ln} x={cx} y={y + r + 16 + li * lineH} textAnchor="middle" className="rail__cap">{ln}</text>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

export default function CaseStudies() {
  return (
    <div className="cases">
      {STUDIES.map((s) => (
        <article className="case" key={s.id}>
          <div className="case__head">
            <span className="ucase case__id">{s.id}</span>
            <h3>{s.title}</h3>
            <div className="case__tags">
              <span className="ucase case__tag">{s.practice}</span>
              <span className="ucase case__tag">{s.pms}</span>
            </div>
          </div>

          <p className="case__redact">
            <span className="case__bar" aria-hidden="true" />
            <span className="ucase">Client name withheld</span>
          </p>

          <div className="case__body">
            <div>
              <p className="case__problem">{s.problem}</p>
              <ol className="case__steps">
                {s.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
            <div className="case__rail"><Rail nodes={s.rail} /></div>
          </div>
        </article>
      ))}
    </div>
  )
}
