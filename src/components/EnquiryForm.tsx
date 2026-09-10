import { useRef, useState } from 'react'

const WEBHOOK = 'https://hook.eu1.make.com/waciaz78ykdmfaxh4glg6vdhjjqi4jh5'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PMS = ['Clio', 'Smokeball', 'Actionstep', 'myCase', 'LEAP', 'Something else']

type State = 'idle' | 'sending' | 'error' | 'done'

/** The two forms ask for slightly different things — donna wants a phone
 *  number and an area of law, the contact page wants the problem in prose. */
type Variant = 'donna' | 'contact'

/** Same webhook, same validation, same copy as the static build — the only
 *  change is that React owns the state instead of replaceWith(). */
export default function EnquiryForm({
  variant = 'donna',
  source,
}: { variant?: Variant; source?: string } = {}) {
  const form = useRef<HTMLFormElement>(null)
  const [state, setState] = useState<State>('idle')
  const [note, setNote] = useState('')

  const fail = (message: string, field?: HTMLElement | null) => {
    setState('error')
    setNote(message)
    if (field) {
      field.setAttribute('aria-invalid', 'true')
      field.focus()
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const el = form.current
    if (!el) return

    el.querySelectorAll('[aria-invalid]').forEach((n) => n.removeAttribute('aria-invalid'))
    const data = Object.fromEntries(new FormData(el).entries()) as Record<string, string>

    if (!data.name) return fail('Add your name so we know who we are replying to.', el.elements.namedItem('name') as HTMLElement)
    if (!data.email || !EMAIL.test(data.email)) {
      return fail('Check the email address — we could not read that one.', el.elements.namedItem('email') as HTMLElement)
    }

    setState('sending')
    setNote('Sending…')

    try {
      const res = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: source ?? (variant === 'donna' ? 'jdotai.com/legal' : 'jdotai.com/contact'),
          submitted_at: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState('done')
    } catch {
      fail('That did not send. Email jai@jdotai.com and we will pick it up there.')
    }
  }

  if (state === 'done') {
    return (
      <div className="enq-done">
        <h3>Enquiry received.</h3>
        <p>We will be in touch within 24 hours.</p>
      </div>
    )
  }

  return (
    <form className="enq" id="enq" ref={form} noValidate onSubmit={onSubmit}>
      <label>Name<input name="name" type="text" autoComplete="name" required /></label>
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      {variant === 'donna' && (
        <label>Phone<input name="phone" type="tel" autoComplete="tel" placeholder="+61 4xx xxx xxx" /></label>
      )}
      <label>Firm<input name="firm" type="text" autoComplete="organization" /></label>
      <label>
        Practice management system
        <select name="pms" defaultValue="">
          <option value="">Select one</option>
          {PMS.map((p) => <option key={p}>{p}</option>)}
          {variant === 'contact' && <option>None yet</option>}
        </select>
      </label>
      {variant === 'donna' ? (
        <label>Area of law<input name="area" type="text" /></label>
      ) : (
        <label>What is taking up the time?<textarea name="message" rows={4} /></label>
      )}
      <p className="enq-note" id="enq-note" role="status" aria-live="polite" data-state={state === 'error' ? 'error' : undefined}>
        {note}
      </p>
      <button className="btn" type="submit" id="enq-submit" aria-busy={state === 'sending'} disabled={state === 'sending'}>
        Send enquiry
      </button>
    </form>
  )
}
