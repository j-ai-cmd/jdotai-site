import CaseStudies from '@/components/CaseStudies'
import EnquiryForm from '@/components/EnquiryForm'
import HoursCalculator from '@/components/HoursCalculator'
import { FadeUp } from '@/components/amicro/fade-up'
import { FigureReveal } from '@/components/amicro/figure-reveal'
import { Magnetic } from '@/components/amicro/magnetic'
import { TextReveal } from '@/components/amicro/text-reveal'
import { BrandHoursArea } from '@/components/mono-charts/BrandHoursArea'
import { BrandTaskBars } from '@/components/mono-charts/BrandTaskBars'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSeo } from '@/lib/seo'

const META = {
  title: 'donna — AI intake and PMS connector for law firms | jdotai',
  description:
    'donna gives your firm a custom intake form that syncs straight into Clio, Smokeball, Actionstep, myCase or LEAP, and lets you query your matters in plain English inside Claude or ChatGPT.',
  path: '/donna',
} as const

const FIGURES = [
  { n: '5', u: '', c: 'Practice management systems' },
  { n: '3', u: '', c: 'AI assistants' },
  { n: '2', u: 'wks', c: 'Signing to live' },
  { n: '24', u: 'hrs', c: 'To hear back, every time' },
]

const CONNECTS = ['Clio', 'Smokeball', 'Actionstep', 'myCase', 'LEAP', 'Claude', 'ChatGPT', 'Kimi']

const REGISTER = [
  { n: 'F-01', t: 'Re-typing intake', b: 'Every new matter, copied by hand from an email into the practice management system.' },
  { n: 'F-02', t: 'Chasing documents', b: 'Follow-ups that exist only because the first request went unanswered.' },
  { n: 'F-03', t: 'Emails into tasks', b: 'Someone still has to read it, decide what it means, and open a task for it.' },
  { n: 'F-04', t: 'Conflict checks by hand', b: 'Searching the same three places before a matter can be opened at all.' },
  { n: 'F-05', t: 'Notes into the file', b: 'A call happens, and the record of it waits until someone types it up.' },
  { n: 'F-06', t: 'The same five questions', b: 'Answered again by email, because the answer lives in someone’s head.' },
]

const METHOD = [
  { n: '01', t: 'We map your intake', b: 'What your firm asks, in what order, for which matter types. We work from your existing forms.' },
  { n: '02', t: 'We wire your system', b: 'donna connects to your practice management system and we confirm fields land where you expect.' },
  { n: '03', t: 'You go live', b: 'You send clients a link. Matters arrive structured, and you stay in control of every field.' },
]

const FAQ = [
  { q: 'What practice management systems does donna connect to?', a: 'Clio, Smokeball, Actionstep, myCase and LEAP. We’re actively expanding the list — if yours isn’t there yet, get in touch.' },
  { q: 'How long does it take to get set up?', a: 'You are live in two weeks.' },
  { q: 'Do my clients need to create an account?', a: 'No. Clients receive a link to the intake form and fill it at their leisure. Progress is saved as they go.' },
  { q: 'How does the MCP connector work?', a: 'donna lets you talk to your practice management system in plain English, right inside Claude or ChatGPT.' },
  { q: 'Where does our client data go?', a: 'Into your own systems. We do not hold client data, and nothing is used to train a model.' },
  { q: 'Who owns what you build?', a: 'You do. It runs on your systems, in your accounts, and we hand over the keys at the end.' },
]

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

export default function Donna() {
  useSeo(META)

  return (
    <main id="main">
      <section className="hero">
        <div className="hero__in">
          <TextReveal as="h1" text="Your intake, in your system, without the typing." />
          <FadeUp delay={0.15}>
            <div className="hero__dek">
              <p className="lede">
                <span className="donna">donna</span> collects what your firm actually asks,
                files it as a matter, and lets you ask questions about it in plain English.
              </p>
              <div className="go">
                <Magnetic><Button asChild size="lg"><a href="#report">Work out your hours</a></Button></Magnetic>
                <Button asChild variant="outline" size="lg"><a href="#enquire">Get donna</a></Button>
              </div>
            </div>
            <div className="figures">
              {FIGURES.map((f) => (
                <div className="figure-cell" key={f.c}>
                  <div className="figure-cell__n">{f.n}{f.u && <span className="figure-cell__u">{f.u}</span>}</div>
                  <div className="figure-cell__c">{f.c}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="marquee">
        <div className="marquee__run">
          {CONNECTS.map((c) => <span className="marquee__item" key={c}>{c}</span>)}
          {CONNECTS.map((c) => <span className="marquee__item" key={`${c}-e`} aria-hidden="true">{c}</span>)}
        </div>
      </div>

      {/* the console */}
      <section className="section">
        <div className="section-in">
          <div className="pair">
            <FadeUp>
              <h2>One place, asked in plain English.</h2>
              <p className="lede">
                Clients fill in the intake themselves. It lands in your practice management
                system as a matter, with contacts and documents attached.
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
                      <thead><tr className="ucase"><th>Ref</th><th>Client</th><th>Type</th><th>State</th></tr></thead>
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
                        {INTAKE_FIELDS.map(([k, val]) => (
                          <div key={k}>
                            <div className="ucase console__k">{k}</div>
                            <div className="console__v">{val}</div>
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
                      <p className="console__typing"><span className="console__caret" aria-hidden="true" />writing</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </FigureReveal>
          </div>
        </div>
      </section>

      {/* the register */}
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

      {/* the calculator */}
      <section className="section section--top" id="report">
        <div className="section-in">
          <div className="section-head">
            <h2>Work out what it costs you.</h2>
            <p className="lede">
              Four numbers from your own firm. Everything below is arithmetic on what you type.
            </p>
          </div>
          <FigureReveal><HoursCalculator /></FigureReveal>
        </div>
      </section>

      {/* case studies */}
      <section className="section section--tint section--top" id="cases">
        <div className="section-in">
          <div className="section-head">
            <h2>Seven automations we build.</h2>
            <p className="lede">
              Each one built end to end on the system the firm already runs. The work is real
              and the firms are real. The names are withheld.
            </p>
          </div>
          <CaseStudies />
        </div>
      </section>

      {/* charts */}
      <section className="section section--top">
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

      {/* method */}
      <section className="section section--tint">
        <div className="section-in">
          <FadeUp><p className="belief">Two weeks from signing to live.</p></FadeUp>
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

      <section className="section section--top" id="enquire">
        <div className="section-in">
          <div className="pair pair--head">
            <FadeUp><h2>Tell us which system you run on.</h2></FadeUp>
            <FigureReveal><EnquiryForm /></FigureReveal>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="section-in section-in--mid">
          <h2>Get <span className="donna">donna</span> for your firm.</h2>
          <div className="go">
            <Magnetic>
              <Button asChild size="lg" variant="secondary"><a href="#enquire">Send an enquiry</a></Button>
            </Magnetic>
          </div>
        </div>
      </section>
    </main>
  )
}
