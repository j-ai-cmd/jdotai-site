import EnquiryForm from '@/components/EnquiryForm'
import { FadeUp } from '@/components/amicro/fade-up'
import { FigureReveal } from '@/components/amicro/figure-reveal'
import { Magnetic } from '@/components/amicro/magnetic'
import { TextReveal } from '@/components/amicro/text-reveal'
import { BrandHoursArea } from '@/components/mono-charts/BrandHoursArea'
import { BrandTaskBars } from '@/components/mono-charts/BrandTaskBars'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSeo } from '@/lib/seo'

const META = {
  title: 'jdotai — AI advisory and custom tools, and donna for law firms',
  description:
    'jdotai finds the work your business still does by hand and builds the tools that take it over. donna connects Clio, Smokeball, Actionstep, myCase and LEAP to Claude and ChatGPT.',
  path: '/',
} as const

/** Four true counts. Each is something we can point at: the systems donna
 *  connects to, the assistants it speaks through, the time to go live, and
 *  the reply window we hold ourselves to. */
const FIGURES = [
  { n: '5', u: '', c: 'Practice management systems' },
  { n: '3', u: '', c: 'AI assistants' },
  { n: '2', u: 'wks', c: 'Signing to live' },
  { n: '24', u: 'hrs', c: 'To hear back, every time' },
]

/** What donna actually connects to. An inventory, not a customer list. */
const CONNECTS = ['Clio', 'Smokeball', 'Actionstep', 'myCase', 'LEAP', 'Claude', 'ChatGPT', 'Kimi']

/** The register. Named pain points, not measured claims — nothing here counts
 *  anything, so nothing here can be wrong about a number. */
const REGISTER = [
  { n: 'F-01', t: 'Re-typing intake', b: 'Every new matter, copied by hand from an email into the practice management system.' },
  { n: 'F-02', t: 'Chasing documents', b: 'Follow-ups that exist only because the first request went unanswered.' },
  { n: 'F-03', t: 'Emails into tasks', b: 'Someone still has to read it, decide what it means, and open a task for it.' },
  { n: 'F-04', t: 'Conflict checks by hand', b: 'Searching the same three places before a matter can be opened at all.' },
  { n: 'F-05', t: 'Notes into the file', b: 'A call happens, and the record of it waits until someone types it up.' },
  { n: 'F-06', t: 'The same five questions', b: 'Answered again by email, because the answer lives in someone’s head.' },
]

const OFFERS = [
  {
    n: '01',
    name: 'Advisory',
    line: 'A monthly read on what changed in AI and what applies to you.',
    points: ['What shipped this month', 'What it means for your firm', 'What to do about it'],
  },
  {
    n: '02',
    name: 'Labs',
    line: 'When the tool you need does not exist, we build it.',
    points: ['Custom automations', 'Agents on your systems', 'You own the result'],
  },
]

const METHOD = [
  { n: '01', t: 'We map your intake', b: 'What your firm asks, in what order, for which matter types. We work from your existing forms.' },
  { n: '02', t: 'We wire your system', b: 'donna connects to your practice management system and we confirm fields land where you expect.' },
  { n: '03', t: 'You go live', b: 'You send clients a link. Matters arrive structured, and you stay in control of every field.' },
]

const FAQ = [
  {
    q: 'What practice management systems does donna connect to?',
    a: 'Clio, Smokeball, Actionstep, myCase and LEAP. We’re actively expanding the list — if yours isn’t there yet, get in touch.',
  },
  { q: 'How long does it take to get set up?', a: 'You are live in two weeks.' },
  {
    q: 'Do my clients need to create an account?',
    a: 'No. Clients receive a link to the intake form and fill it at their leisure. Progress is saved as they go.',
  },
  {
    q: 'How does the MCP connector work?',
    a: 'donna lets you talk to your practice management system in plain English, right inside Claude or ChatGPT.',
  },
  {
    q: 'Who owns what you build?',
    a: 'You do. It runs on your systems, in your accounts, and we hand over the keys at the end.',
  },
]

/** Sample rows for the console. Shaped like real matters and labelled as a
 *  sample in the UI — the point is the interface, not the records. */
const MATTERS = [
  { ref: 'M-2041', client: 'Whitfield', type: 'Estate planning', state: 'Synced' },
  { ref: 'M-2042', client: 'Okonkwo', type: 'Conveyancing', state: 'Synced' },
  { ref: 'M-2043', client: 'Baptiste', type: 'Family law', state: 'In review' },
  { ref: 'M-2044', client: 'Nakamura', type: 'Estate planning', state: 'Awaiting docs' },
]

const INTAKE_FIELDS: [string, string][] = [
  ['Full name', 'Ada Whitfield'],
  ['Matter type', 'Estate planning'],
  ['Email', 'ada@example.com'],
  ['Executor', 'R. Whitfield'],
]

export default function Home() {
  useSeo(META)

  return (
    <main id="main">
      {/* ── hero ─────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__in">
          <TextReveal as="h1" text="New AI tools land every week." />
          <FadeUp delay={0.15}>
            <div className="hero__dek">
              <p className="lede">
                You don’t have time to sort them. We do that, then build what’s missing.
              </p>
              <div className="go">
                <Magnetic>
                  <Button asChild size="lg"><a href="#donna">See donna</a></Button>
                </Magnetic>
                <Button asChild variant="outline" size="lg"><a href="#enquire">Book a call</a></Button>
              </div>
            </div>
            <div className="figures">
              {FIGURES.map((f) => (
                <div className="figure-cell" key={f.c}>
                  <div className="figure-cell__n">
                    {f.n}{f.u && <span className="figure-cell__u">{f.u}</span>}
                  </div>
                  <div className="figure-cell__c">{f.c}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── what donna connects to ───────────────────────────────────── */}
      <div className="marquee">
        <div className="marquee__run">
          {CONNECTS.map((c) => <span className="marquee__item" key={c}>{c}</span>)}
          {CONNECTS.map((c) => (
            <span className="marquee__item" key={`${c}-echo`} aria-hidden="true">{c}</span>
          ))}
        </div>
      </div>

      {/* ── donna ────────────────────────────────────────────────────── */}
      <section className="section" id="donna">
        <div className="section-in">
          <div className="pair">
            <FadeUp>
              <h2><span className="donna">donna</span>, for law firms.</h2>
              <p className="lede">
                Clients fill in the intake themselves. It lands in your practice management
                system as a matter, with contacts and documents attached. Then you ask about
                it in plain English, inside Claude or ChatGPT.
              </p>
              <ul className="ticks">
                <li>Custom intake, built for your fields</li>
                <li>Syncs to your practice management system</li>
                <li>Ask your matters a question</li>
              </ul>
            </FadeUp>
            <FigureReveal>
              <div className="console">
                <div className="console__bar">
                  <span className="console__dot" aria-hidden="true" />
                  <span className="console__dot" aria-hidden="true" />
                  <span className="console__dot" aria-hidden="true" />
                  <span className="ucase console__name">donna console</span>
                  <span className="flag console__flag">Sample</span>
                </div>
                <Tabs defaultValue="matters">
                  <TabsList className="console__tabs">
                    <TabsTrigger className="ucase" value="matters">Matters</TabsTrigger>
                    <TabsTrigger className="ucase" value="intake">Intake</TabsTrigger>
                    <TabsTrigger className="ucase" value="ask">Ask</TabsTrigger>
                  </TabsList>

                  <TabsContent value="matters">
                    <div className="console__scroll">
                    <table className="console__table">
                      <thead>
                        <tr className="ucase">
                          <th>Ref</th><th>Client</th><th>Type</th><th>State</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MATTERS.map((m) => (
                          <tr key={m.ref}>
                            <td className="console__ref">{m.ref}</td>
                            <td>{m.client}</td>
                            <td className="console__dim">{m.type}</td>
                            <td><span className="console__state">{m.state}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="intake">
                    <div className="console__body">
                      <div className="console__fields">
                        {INTAKE_FIELDS.map(([k, v]) => (
                          <div key={k}>
                            <div className="ucase console__k">{k}</div>
                            <div className="console__v">{v}</div>
                          </div>
                        ))}
                      </div>
                      <div className="console__foot">
                        <span className="ucase">Step 2 of 4</span>
                        <span className="console__track"><span className="console__fill" /></span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="ask">
                    <div className="console__body console__ask">
                      <p className="console__q">&gt; which matters are waiting on documents?</p>
                      <p className="console__a">
                        One matter is waiting: M-2044, Nakamura, estate planning. The client has
                        not uploaded the executor ID. Last chased four days ago.
                      </p>
                      <p className="console__q">&gt; draft a follow-up</p>
                      <p className="console__typing">
                        <span className="console__caret" aria-hidden="true" />writing
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </FigureReveal>
          </div>
        </div>
      </section>

      {/* ── the register ─────────────────────────────────────────────── */}
      <section className="section section--tint section--top">
        <div className="section-in">
          <div className="pair pair--head">
            <FadeUp>
              <h2>The work nobody logs.</h2>
              <p className="lede">It lands in the gaps around the work you bill for.</p>
            </FadeUp>
            <FigureReveal>
              <div className="register">
                {REGISTER.map((r) => (
                  <div className="register__row" key={r.n}>
                    <span className="ucase register__n">{r.n}</span>
                    <h3>{r.t}</h3>
                    <p>{r.b}</p>
                  </div>
                ))}
              </div>
            </FigureReveal>
          </div>
        </div>
      </section>

      {/* ── where the hours go ───────────────────────────────────────── */}
      <section className="section">
        <div className="section-in">
          <div className="flag-row">
            <h2>Where the hours go.</h2>
            <span className="flag">Illustrative, not measured</span>
          </div>
          <FigureReveal>
            <div className="chart-row">
              <BrandHoursArea />
              <BrandTaskBars />
            </div>
          </FigureReveal>
        </div>
      </section>

      {/* ── engagements ──────────────────────────────────────────────── */}
      <section className="section section--top">
        <div className="section-in">
          <div className="section-head">
            <h2>Two ways to work with jdotai.</h2>
          </div>
          <div className="offers">
            {OFFERS.map((o) => (
              <FadeUp key={o.n}>
                <div className="offer">
                  <span className="ucase offer__n">{o.n}</span>
                  <h3>{o.name}</h3>
                  <p>{o.line}</p>
                  <ul className="ticks">
                    {o.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── method ───────────────────────────────────────────────────── */}
      <section className="section section--tint">
        <div className="section-in">
          <FadeUp>
            <p className="belief">Software should take the jobs nobody wants.</p>
          </FadeUp>
          <div className="method">
            {METHOD.map((m) => (
              <FadeUp key={m.n}>
                <div className="method__step">
                  <span className="ucase method__n">{m.n}</span>
                  <h3>{m.t}</h3>
                  <p>{m.b}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── faq ──────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="section-in">
          <div className="pair pair--head">
            <FadeUp><h2>Questions.</h2></FadeUp>
            <Accordion type="single" collapsible>
              {FAQ.map((f) => (
                <AccordionItem value={f.q} key={f.q} className="faq-item">
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── enquiry ──────────────────────────────────────────────────── */}
      <section className="section section--top" id="enquire">
        <div className="section-in">
          <div className="pair pair--head">
            <FadeUp><h2>Tell us what’s taking the time.</h2></FadeUp>
            <FigureReveal>
              <EnquiryForm />
            </FigureReveal>
          </div>
        </div>
      </section>

      {/* ── closing ──────────────────────────────────────────────────── */}
      <section className="cta-band">
        <div className="section-in section-in--mid">
          <h2>Stop doing work that shouldn’t need you.</h2>
          <div className="go">
            <Magnetic>
              <Button asChild size="lg" variant="secondary">
                <a href="#enquire">Send an enquiry</a>
              </Button>
            </Magnetic>
          </div>
        </div>
      </section>
    </main>
  )
}
