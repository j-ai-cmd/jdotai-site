import { useEffect, useRef } from 'react'
import ConnectionMap from '@/components/ConnectionMap'
import DemoVideo from '@/components/DemoVideo'
import EnquiryForm from '@/components/EnquiryForm'
import { FadeUp } from '@/components/amicro/fade-up'
import { FigureReveal } from '@/components/amicro/figure-reveal'
import { TextReveal } from '@/components/amicro/text-reveal'
import { BrandStatTile } from '@/components/mono-charts/BrandStatTile'
import { BrandBulletChart } from '@/components/mono-charts/BrandBulletChart'
import { BrandGaugeRing } from '@/components/mono-charts/BrandGaugeRing'
import { BrandStepFlow } from '@/components/mono-charts/BrandStepFlow'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
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

const STEPS = [
  { title: 'We map your intake', body: 'What your firm asks, in what order, for which matter types. We work from your existing forms.' },
  { title: 'We wire your system', body: 'donna connects to your practice management system and we confirm fields land where you expect.' },
  { title: 'You go live', body: 'You send clients a link. Matters arrive structured, and you stay in control of every field.' },
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
            <div className="askline">
              <span className="q" id="askq" ref={askRef} aria-live="off" />
              <span className="go" aria-hidden="true">Ask</span>
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="essay">
        <FadeUp>
          <p className="lede">
            <span className="donna">donna</span> connects Clio, Smokeball, Actionstep, myCase and
            LEAP to Claude and ChatGPT, so your matters answer back in plain English — and gives
            your firm a custom intake form that syncs straight into whichever of those five your
            firm already runs on.
          </p>
        </FadeUp>

        <FigureReveal>
          <figure className="figure">
            <div className="stat-tiles">
              <BrandStatTile value={CONNECTS.pms} outOf={CONNECTS.pms} label="Practice management systems" />
              <BrandStatTile value={CONNECTS.assistants} outOf={CONNECTS.assistants} label="AI assistants" />
              <BrandBulletChart weeks={2} fromLabel="Signing" toLabel="Live" />
              <BrandGaugeRing value={24} unit="hours" label="to hear back — every time" />
            </div>
          </figure>
        </FigureReveal>

        <h2>Two things, one system.</h2>
        <p>
          A custom intake form collects exactly what your firm needs, and syncs it straight to
          your practice management system. Clients get a link, fill it at their own pace, and
          progress is saved as they go — no account to create.
        </p>
        <p>
          An MCP connector gives your AI assistant live access to your practice management
          system, so you can ask about your matters in plain English, from inside Claude or
          ChatGPT.
        </p>

        <FigureReveal>
          <div className="figure">
            <ConnectionMap />
          </div>
        </FigureReveal>

        <h2>See it work.</h2>
        <p>A client completing intake, and a firm asking a question in plain English.</p>

        <FigureReveal>
          <DemoVideo
            className="figure"
            src="/assets/video/donna-intake.mp4"
            poster="/assets/video/donna-intake-poster.jpg"
            caption="donna Intake — a client completes intake; the matter lands in the PMS."
          />
        </FigureReveal>
        <FigureReveal>
          <DemoVideo
            className="figure"
            src="/assets/video/donna-mcp.mp4"
            poster="/assets/video/donna-mcp-poster.jpg"
            caption="donna MCP — asking a practice management system questions in plain English."
          />
        </FigureReveal>

        <Separator className="ornament" />

        <h2>How it moves.</h2>
        <p>
          A client completes your custom intake form and provides everything you need upfront.
          <span className="donna"> donna</span> collects, organises and processes that information
          automatically. The matter arrives structured, in the system your firm already runs on.
        </p>

        <FigureReveal>
          <figure className="figure figure--reel">
            <video
              src="/assets/video/process-reel.mp4"
              muted
              playsInline
              autoPlay
              loop
              preload="metadata"
              aria-label="Client, donna, and your practice management system, in sequence"
            />
          </figure>
        </FigureReveal>

        <h2>Live in two weeks.</h2>
        <FigureReveal>
          <div className="figure">
            <BrandStepFlow steps={STEPS} />
          </div>
        </FigureReveal>

        <h2>What it connects to.</h2>
        <p>
          Practice management: Clio, Smokeball, Actionstep, myCase, LEAP. AI assistants: Claude,
          ChatGPT, and Kimi for firms that self-host.
        </p>

        <h2>Questions.</h2>
        <Accordion type="single" collapsible>
          {FAQ.map((f) => (
            <AccordionItem value={f.q} key={f.q} className="faq-item">
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Separator className="ornament" />

        <h2>Tell us about your firm.</h2>
        <p>Six fields. We read every one, and we reply within 24 hours.</p>
        <FigureReveal>
          <div className="figure">
            <EnquiryForm />
          </div>
        </FigureReveal>
      </div>
    </main>
  )
}
