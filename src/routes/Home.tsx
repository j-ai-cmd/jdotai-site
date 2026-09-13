import { Link } from 'react-router-dom'
import EnquiryForm from '@/components/EnquiryForm'
import PostCards from '@/components/PostCards'
import { FadeUp } from '@/components/amicro/fade-up'
import { FigureReveal } from '@/components/amicro/figure-reveal'
import { Magnetic } from '@/components/amicro/magnetic'
import { TextReveal } from '@/components/amicro/text-reveal'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { posts } from '@/lib/posts'
import { useSeo } from '@/lib/seo'

const META = {
  title: 'jdotai — AI advisory and custom tools',
  description:
    'jdotai finds the work your business still runs on people instead of systems, and builds the tools that take it over. Advisory every month, custom builds when the tool does not exist.',
  path: '/',
} as const

const published = posts.filter((p) => p.published)

/** Four counts, each checkable. The notes figure is the length of the index
 *  on /blog; the systems figure is the integration list on the donna page;
 *  the other two are commitments we hold ourselves to. Nothing here is a
 *  claim about a result. */
const FIGURES = [
  { n: String(published.length), u: '', c: 'Notes published' },
  { n: '2', u: '', c: 'Ways to work together' },
  { n: '5', u: '', c: 'Systems wired so far' },
  { n: '24', u: 'hrs', c: 'To hear back, every time' },
]

const BUILT_WITH = ['Make.com', 'Claude', 'MCP', 'Clio', 'Smokeball', 'Actionstep', 'myCase', 'LEAP']

const REGISTER = [
  { n: 'F-01', t: 'Re-keying between systems', b: 'The same details typed twice because two tools do not speak to each other.' },
  { n: 'F-02', t: 'Chasing what never arrived', b: 'Follow-ups that exist only because the first request went unanswered.' },
  { n: 'F-03', t: 'Rebuilding the same report', b: 'Assembled by hand, on a schedule, from the same places every time.' },
  { n: 'F-04', t: 'Reading to route', b: 'Someone opens it, decides what it means, and passes it on.' },
  { n: 'F-05', t: 'The answer in someone’s head', b: 'A question only one person can answer, asked again every week.' },
  { n: 'F-06', t: 'Work that waits for a person', b: 'A step that could run on its own, queued behind whoever is free.' },
]

/** The ledger. Same rows both sides, so the asymmetry does the arguing. */
const LEDGER = [
  { row: 'A new record', hand: 'Typed in twice', system: 'Created once, filed itself' },
  { row: 'A missing document', hand: 'Noticed eventually', system: 'Flagged the day it is late' },
  { row: 'The monthly report', hand: 'A Friday afternoon', system: 'Waiting on Monday' },
  { row: 'A question about your data', hand: 'Click through to find it', system: 'Asked in plain English' },
  { row: 'A process that works', hand: 'In one person’s head', system: 'Written down and running' },
]

const OFFERS = [
  {
    n: '01', name: 'Advisory',
    line: 'A monthly read on what changed in AI and what applies to you.',
    points: ['What shipped this month', 'What it means for your business', 'What to do about it'],
  },
  {
    n: '02', name: 'Labs',
    line: 'When the tool you need does not exist, we build it.',
    points: ['Custom automations', 'Agents on your systems', 'You own the result'],
  },
]

const METHOD = [
  { n: '01', t: 'We watch the work', b: 'A few weeks inside how your business actually runs, with the people doing it.' },
  { n: '02', t: 'We build one thing', b: 'One tool at a time, wired into the systems your team already opens every day.' },
  { n: '03', t: 'You keep it', b: 'It runs on your side, in your accounts. You own it, and we hand over the keys.' },
]

const FAQ = [
  { q: 'What size of business is this for?', a: 'Small and mid-size teams, where the admin lands on the people doing the billable work. There is no minimum headcount.' },
  { q: 'Do we have to replace our systems?', a: 'No. We build on whatever you already pay for. Replacing a working system is the most expensive way to fix a workflow.' },
  { q: 'How quickly does something go live?', a: 'The first working tool inside a few weeks. We build one thing at a time rather than shipping a platform you have to adopt all at once.' },
  { q: 'Who owns what you build?', a: 'You do. It runs on your systems, in your accounts, and we hand over the keys at the end.' },
  { q: 'Do you work outside legal?', a: 'Yes. donna is our legal product, but the advisory and the custom builds are not industry-specific.' },
]

export default function Home() {
  useSeo(META)

  return (
    <main id="main">
      <section className="hero">
        <div className="hero__in">
          <TextReveal as="h1" text="New AI tools land every week." />
          <FadeUp delay={0.15}>
            <div className="hero__dek">
              <p className="lede">
                You don’t have time to sort them. We do that, then build what’s missing.
              </p>
              <div className="go">
                <Magnetic><Button asChild size="lg"><Link to="/donna">See donna</Link></Button></Magnetic>
                <Button asChild variant="outline" size="lg"><a href="#enquire">Book a call</a></Button>
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
          {BUILT_WITH.map((c) => <span className="marquee__item" key={c}>{c}</span>)}
          {BUILT_WITH.map((c) => <span className="marquee__item" key={`${c}-e`} aria-hidden="true">{c}</span>)}
        </div>
      </div>

      {/* the register */}
      <section className="section">
        <div className="section-in">
          <div className="pair pair--head">
            <FadeUp>
              <h2>The work nobody logs.</h2>
              <p className="lede">It lands in the gaps around the work you charge for.</p>
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

      {/* the ledger */}
      <section className="section section--tint section--top">
        <div className="section-in">
          <div className="section-head">
            <h2>The same week, twice.</h2>
          </div>
          <FigureReveal>
            <div className="ledger">
              <div className="ledger__head">
                <span className="ucase" />
                <span className="ucase">By hand</span>
                <span className="ucase">On a system</span>
              </div>
              {LEDGER.map((l) => (
                <div className="ledger__row" key={l.row}>
                  <span className="ledger__what">{l.row}</span>
                  <span className="ledger__hand">{l.hand}</span>
                  <span className="ledger__sys">{l.system}</span>
                </div>
              ))}
            </div>
          </FigureReveal>
        </div>
      </section>

      {/* engagements */}
      <section className="section section--top">
        <div className="section-in">
          <div className="section-head"><h2>Two ways to work with jdotai.</h2></div>
          <div className="offers">
            {OFFERS.map((o) => (
              <FadeUp key={o.n}>
                <div className="offer">
                  <span className="ucase offer__n">{o.n}</span>
                  <h3>{o.name}</h3>
                  <p>{o.line}</p>
                  <ul className="ticks">{o.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* method */}
      <section className="section section--tint">
        <div className="section-in">
          <FadeUp><p className="belief">Software should take the jobs nobody wants.</p></FadeUp>
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

      {/* latest notes */}
      <section className="section section--top">
        <div className="section-in">
          <div className="flag-row">
            <h2>Written as we build.</h2>
            <Link className="cta-link" to="/blog">All {published.length} notes</Link>
          </div>
          <FigureReveal><PostCards posts={published.slice(0, 4)} /></FigureReveal>
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
            <FadeUp><h2>Tell us what’s taking the time.</h2></FadeUp>
            <FigureReveal><EnquiryForm /></FigureReveal>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="section-in section-in--mid">
          <h2>Stop doing work that shouldn’t need you.</h2>
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
