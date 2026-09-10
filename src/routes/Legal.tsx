import { useEffect, useRef } from 'react'
import ConnectionMap from '@/components/ConnectionMap'
import DemoVideo from '@/components/DemoVideo'
import EnquiryForm from '@/components/EnquiryForm'
import { FadeUp } from '@/components/amicro/fade-up'
import { TextReveal } from '@/components/amicro/text-reveal'
import { BrandStatTile } from '@/components/mono-charts/BrandStatTile'
import { BrandBulletChart } from '@/components/mono-charts/BrandBulletChart'
import { BrandGaugeRing } from '@/components/mono-charts/BrandGaugeRing'
import { initAskLine } from '@/lib/effects'
import { useSeo } from '@/lib/seo'

const META = {
  title: 'donna — AI intake and PMS connector for law firms | jdotai',
  description:
    'donna connects Clio, Smokeball, Actionstep, myCase and LEAP to Claude and ChatGPT, and gives your firm a custom intake form that syncs straight to your practice management system.',
  path: '/legal',
} as const

const QUESTIONS = [
  'Which estate planning matters are missing a signed will?',
  'What documents are still outstanding on my open matters?',
  'Which intakes came in this week?',
  'Which files are ready to close?',
]

const CONNECTS = { pms: 5, assistants: 3 }

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
]

export default function Legal() {
  useSeo(META)
  const askRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!askRef.current) return
    return initAskLine(askRef.current, QUESTIONS)
  }, [])

  return (
    <main id="main">
      <section className="open">
        <div className="narrow">
          <TextReveal as="h1" text="Ask your practice management system a question." />
          <FadeUp delay={0.15}>
            <p className="lede">
              <span className="donna">donna</span> connects Clio, Smokeball, Actionstep, myCase and
              LEAP to Claude and ChatGPT, so your matters answer back in plain English.
            </p>
            <div className="askline">
              <span className="q" id="askq" ref={askRef} aria-live="off" />
              <span className="go" aria-hidden="true">Ask</span>
            </div>
            <p className="askline-note">
              Real questions, answered by <span className="donna">donna</span> inside your own assistant.
            </p>
            <div className="go">
              <a className="btn" href="#enquire">Get donna for your firm</a>
              <a className="btn btn--line" href="#demos">Watch the demos</a>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="figures" aria-label="donna in numbers">
        <div className="in wide stat-tiles">
          <BrandStatTile value={CONNECTS.pms} outOf={CONNECTS.pms} label="Practice management systems" />
          <BrandStatTile value={CONNECTS.assistants} outOf={CONNECTS.assistants} label="AI assistants" />
          <BrandBulletChart weeks={2} fromLabel="Signing" toLabel="Live" />
          <BrandGaugeRing value={24} unit="hours" label="to hear back — every time" />
        </div>
      </section>

      <section className="sec">
        <div className="in mid">
          <h2>Two things, one system.</h2>
          <dl className="pairs">
            <div>
              <dt>Intake</dt>
              <dd>
                A custom intake form that collects exactly what your firm needs, and syncs it
                straight to your practice management system. Clients get a link, fill it at their
                own pace, and progress is saved as they go. No account to create.
              </dd>
            </div>
            <div>
              <dt>Connector</dt>
              <dd>
                An MCP connector that gives your AI assistant live access to your practice
                management system, so you can ask about your matters in plain English — from inside
                Claude or ChatGPT.
              </dd>
            </div>
          </dl>
          <ConnectionMap />
        </div>
      </section>

      <section className="tint" id="demos">
        <div className="in wide">
          <h2>See it work.</h2>
          <div className="demos">
            <div className="demo" data-rise>
              <h3><span className="donna">donna</span> Intake</h3>
              <DemoVideo
                src="/assets/video/donna-intake.mp4"
                poster="/assets/video/donna-intake-poster.jpg"
                caption="A client completes intake; the matter lands in the PMS."
              />
            </div>
            <div className="demo" data-rise>
              <h3><span className="donna">donna</span> MCP</h3>
              <DemoVideo
                src="/assets/video/donna-mcp.mp4"
                poster="/assets/video/donna-mcp-poster.jpg"
                caption="Asking a practice management system questions in plain English."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="in mid">
          <h2>How it moves.</h2>
          <div className="flow">
            <div data-rise>
              <h3>Client</h3>
              <p>Completes your custom intake form and provides everything you need upfront.</p>
            </div>
            <div className="mid-step" data-rise>
              <h3><span className="donna">donna</span></h3>
              <p>Collects, organises and processes your client&rsquo;s information automatically.</p>
            </div>
            <div data-rise>
              <h3>Your PMS</h3>
              <p>The matter arrives structured, in the system your firm already runs on.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tint">
        <div className="in mid">
          <h2>What it connects to.</h2>
          <div className="grouped">
            <div>
              <h3>Practice management</h3>
              <ul className="tags">
                {['Clio', 'Smokeball', 'Actionstep', 'myCase', 'LEAP'].map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
            <div>
              <h3>AI assistants</h3>
              <ul className="tags">
                {['Claude', 'ChatGPT', 'Kimi — self-hosted'].map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="in mid">
          <h2>Live in two weeks.</h2>
          <ol className="seq">
            <li>
              <b>We map your intake</b>
              <span>What your firm asks, in what order, for which matter types. We work from your existing forms.</span>
            </li>
            <li>
              <b>We wire your system</b>
              <span>donna connects to your practice management system and we confirm fields land where you expect.</span>
            </li>
            <li>
              <b>You go live</b>
              <span>You send clients a link. Matters arrive structured, and you stay in control of every field.</span>
            </li>
          </ol>
        </div>
      </section>

      <section className="sec">
        <div className="in mid">
          <h2>Questions.</h2>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p className="ans">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="in mid">
          <h2>Get <span className="donna">donna</span> for your firm.</h2>
          <div className="prose">
            <p>Tell us which system you run on and what your intake looks like today. We reply within 24 hours.</p>
          </div>
          <div className="go"><a className="btn btn--line" href="#enquire">Send an enquiry</a></div>
        </div>
      </section>

      <section className="sec" id="enquire">
        <div className="in mid">
          <h2>Tell us about your firm.</h2>
          <div className="formwrap">
            <div className="prose">
              <p>Six fields. We read every one, and we reply within 24 hours.</p>
            </div>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </main>
  )
}
