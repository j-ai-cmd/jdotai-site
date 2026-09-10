import { useRef, useState } from 'react'
import { FadeUp } from '@/components/amicro/fade-up'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const WEBHOOK = 'https://hook.eu1.make.com/waciaz78ykdmfaxh4glg6vdhjjqi4jh5'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PMS = ['Clio', 'Smokeball', 'Actionstep', 'myCase', 'LEAP', 'Something else']

type State = 'idle' | 'sending' | 'error' | 'done'

/** The two forms ask for slightly different things — donna wants a phone
 *  number and an area of law, the contact page wants the problem in prose. */
type Variant = 'donna' | 'contact'

/** Same webhook, same validation, same copy as the static build — the only
 *  change is that React owns the state instead of replaceWith(). Fields are
 *  now shadcn primitives; the practice-management select can't ride along in
 *  FormData the way a native <select> did, so its value is tracked separately
 *  and merged into the payload at submit time. */
export default function EnquiryForm({
  variant = 'donna',
  source,
}: { variant?: Variant; source?: string } = {}) {
  const form = useRef<HTMLFormElement>(null)
  const [state, setState] = useState<State>('idle')
  const [note, setNote] = useState('')
  const [pms, setPms] = useState('')

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
    data.pms = pms

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
      <FadeUp yOffset={12} duration={0.5}>
        <div className="enq-done">
          <h3>Enquiry received.</h3>
          <p>We will be in touch within 24 hours.</p>
        </div>
      </FadeUp>
    )
  }

  return (
    <form className="enq" id="enq" ref={form} noValidate onSubmit={onSubmit}>
      <div className="enq-field">
        <Label htmlFor="enq-name">Name</Label>
        <Input id="enq-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="enq-field">
        <Label htmlFor="enq-email">Email</Label>
        <Input id="enq-email" name="email" type="email" autoComplete="email" required />
      </div>
      {variant === 'donna' && (
        <div className="enq-field">
          <Label htmlFor="enq-phone">Phone</Label>
          <Input id="enq-phone" name="phone" type="tel" autoComplete="tel" placeholder="+61 4xx xxx xxx" />
        </div>
      )}
      <div className="enq-field">
        <Label htmlFor="enq-firm">Firm</Label>
        <Input id="enq-firm" name="firm" type="text" autoComplete="organization" />
      </div>
      <div className="enq-field">
        <Label htmlFor="enq-pms">Practice management system</Label>
        <Select value={pms} onValueChange={setPms}>
          <SelectTrigger id="enq-pms">
            <SelectValue placeholder="Select one" />
          </SelectTrigger>
          <SelectContent>
            {PMS.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
            {variant === 'contact' && <SelectItem value="None yet">None yet</SelectItem>}
          </SelectContent>
        </Select>
      </div>
      {variant === 'donna' ? (
        <div className="enq-field">
          <Label htmlFor="enq-area">Area of law</Label>
          <Input id="enq-area" name="area" type="text" />
        </div>
      ) : (
        <div className="enq-field">
          <Label htmlFor="enq-message">What is taking up the time?</Label>
          <Textarea id="enq-message" name="message" rows={4} />
        </div>
      )}
      <p className="enq-note" id="enq-note" role="status" aria-live="polite" data-state={state === 'error' ? 'error' : undefined}>
        {note}
      </p>
      <Button type="submit" id="enq-submit" aria-busy={state === 'sending'} disabled={state === 'sending'}>
        Send enquiry
      </Button>
    </form>
  )
}
