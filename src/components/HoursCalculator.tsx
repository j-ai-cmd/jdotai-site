import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/** Every figure this prints is arithmetic on what the reader typed. Nothing
 *  is asserted about "firms like yours", and no benchmark is introduced —
 *  a law firm can check every line against its own numbers, which is the
 *  only kind of claim that survives contact with a regulated buyer.
 *
 *  If a future version adds an industry average, it has to come with a
 *  source, and it stops being derivable arithmetic at that moment. */
type Row = { id: keyof Inputs; label: string; hint: string; unit: string }

type Inputs = {
  matters: number
  rekeyMins: number
  chaseHrs: number
  reportHrs: number
}

const ROWS: Row[] = [
  { id: 'matters', label: 'New matters opened a week', hint: 'Across the whole firm', unit: 'matters' },
  { id: 'rekeyMins', label: 'Minutes re-keying each one', hint: 'Email or form into the practice management system', unit: 'minutes' },
  { id: 'chaseHrs', label: 'Hours a week chasing documents', hint: 'Follow-ups that only exist because the first ask went unanswered', unit: 'hours' },
  { id: 'reportHrs', label: 'Hours a month rebuilding the same reports', hint: 'Anything assembled by hand on a schedule', unit: 'hours' },
]

const START: Inputs = { matters: 12, rekeyMins: 18, chaseHrs: 4, reportHrs: 6 }

function round(n: number) {
  return Math.round(n * 10) / 10
}

export default function HoursCalculator() {
  const [v, setV] = useState<Inputs>(START)

  const parts = useMemo(() => {
    const rekey = (v.matters * v.rekeyMins) / 60
    const chase = v.chaseHrs
    const reports = v.reportHrs / 4.33 // a month of weeks, so every line is per week
    return [
      { name: 'Re-keying intake', hours: rekey },
      { name: 'Chasing documents', hours: chase },
      { name: 'Rebuilding reports', hours: reports },
    ]
  }, [v])

  const weekly = parts.reduce((a, b) => a + b.hours, 0)
  const peak = Math.max(...parts.map((p) => p.hours), 0.001)

  return (
    <div className="calc">
      <div className="calc__in">
        {ROWS.map((r) => (
          <div className="calc__field" key={r.id}>
            <Label htmlFor={r.id}>{r.label}</Label>
            <Input
              id={r.id}
              type="number"
              min={0}
              max={999}
              inputMode="numeric"
              value={Number.isNaN(v[r.id]) ? '' : v[r.id]}
              onChange={(e) => setV({ ...v, [r.id]: Math.max(0, Math.min(999, Number(e.target.value))) })}
            />
            <p className="calc__hint">{r.hint}</p>
          </div>
        ))}
        <Button type="button" className="btn" onClick={() => setV(START)}>Reset</Button>
      </div>

      <div className="calc__out" aria-live="polite">
        <div className="calc__headline">
          <span className="calc__n">{round(weekly)}</span>
          <span className="calc__u">hours a week</span>
        </div>
        <p className="calc__sub">
          {round(weekly * 46)} hours a year, on 46 working weeks.
        </p>

        <div className="calc__bars">
          {parts.map((p) => (
            <div className="calc__bar" key={p.name}>
              <span className="calc__bar-name">{p.name}</span>
              <span className="calc__bar-track">
                <span className="calc__bar-fill" style={{ transform: `scaleX(${p.hours / peak})` }} />
              </span>
              <span className="calc__bar-n">{round(p.hours)}</span>
            </div>
          ))}
        </div>

        <p className="calc__note">
          Every figure here is arithmetic on the four numbers you entered:
          matters times minutes, plus the hours you gave us, with the monthly
          reporting figure divided across the weeks in a month. We have not
          added an industry average or a benchmark, because we would be making
          it up.
        </p>
      </div>
    </div>
  )
}
