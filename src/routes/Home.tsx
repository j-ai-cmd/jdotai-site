import { useEffect, useRef } from 'react'
import ConnectionMap from '@/components/ConnectionMap'
import DemoVideo from '@/components/DemoVideo'
import EnquiryForm from '@/components/EnquiryForm'
import { CharacterEmphasis } from '@/components/amicro/character-emphasis'
import { FadeUp } from '@/components/amicro/fade-up'
import { FigureReveal } from '@/components/amicro/figure-reveal'
import { Magnetic } from '@/components/amicro/magnetic'
import { TextReveal } from '@/components/amicro/text-reveal'
import { BrandBulletChart } from '@/components/mono-charts/BrandBulletChart'
import { BrandGaugeRing } from '@/components/mono-charts/BrandGaugeRing'
import { BrandStatTile } from '@/components/mono-charts/BrandStatTile'
import { BrandStepFlow } from '@/components/mono-charts/BrandStepFlow'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { initAskLine } from '@/lib/effects'
import { useSeo } from '@/lib/seo'

const META = {
  title: 'jdotai — donna, an AI intake and PMS connector for law firms',
  description:
    'donna connects Clio, Smokeball, Actionstep, myCase and LEAP to Claude and ChatGPT, and gives your firm a custom intake form that syncs straight to your practice management system.',
  path: '/',
} as const

const PMS = ['Clio', 'Smokeball', 'Actionstep', 'myCase', 'LEAP']
const ASSISTANTS = ['Claude', 'ChatGPT', 'Kimi']
const CONNECTS = { pms: 5, assistants: 3 }

const QUESTIONS = [
  'Which estate planning matters are missing a signed will?',
  'What documents are still outstanding on my open matters?',
  'Which intakes came in this week?',
  'Which files are ready to close?',
]

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

export default function Home() {
  useSeo(META)
  const askRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!askRef.current) return
    return initAskLine(askRef.current, QUESTIONS)
  }, [])

  return (
    <main id="main">
      {/* ── hero ─────────────────────────────────────────────────────── */}
      <section className="hero section-in">
        <div>
          <TextReveal as="h1" text="Which part of your week shouldn’t need a lawyer?" />
          <FadeUp delay={0.15}>
            <p className="lede">
              <span className="donna">donna</span> handles intake and connects your practice
              management system to Claude and ChatGPT. Live in two weeks.
            </p>
            <div className="askline">
              <span className="q" id="askq" ref={askRef} aria-live="off" />
              <span className="go" aria-hidden="true">Ask</span>
            </div>
            <div className="go">
              <Magnetic>
                <Button asChild size="lg">
                  <a href="#enquire">Get donna for your firm</a>
                </Button>
              </Magnetic>
              <Button asChild variant="outline" size="lg">
                <a href="#demo">Watch it work</a>
              </Button>
            </div>
          </FadeUp>
        </div>
        <FigureReveal className="hero-media">
          <DemoVideo
            src="/assets/video/donna-hero-loop.mp4"
            poster="/assets/video/donna-hero-poster.jpg"
            caption="A client completes intake, and the matter lands in the practice management system."
            ambient
          />
        </FigureReveal>
      </section>

      {/* ── trust bar — real integrations, not customer logos ───────── */}
      <section className="trust" id="donna">
        <div className="section-in">
          <FadeUp>
            <p className="trust__caption">Connects to</p>
            <div className="trust__row">
              {PMS.map((p) => <Badge key={p} variant="outline">{p}</Badge>)}
            </div>
            <div className="trust__row">
              {ASSISTANTS.map((a) => <Badge key={a} variant="secondary">{a}</Badge>)}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── bento feature grid ───────────────────────────────────────── */}
      <section className="section">
        <div className="section-in">
          <FigureReveal>
            <div className="bento">
              <Card className="bento__tile border-0 shadow-none rounded-none">
                <CardHeader className="p-0">
                  <CardTitle asChild><h3>We find what drains you.</h3></CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p>Timekeeping, matter updates, document management. We find what can be automated.</p>
                </CardContent>
              </Card>
              <Card className="bento__tile border-0 shadow-none rounded-none">
                <CardHeader className="p-0">
                  <CardTitle asChild><h3>We build custom tools.</h3></CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p>Wired into what you already use, built for how your team actually works.</p>
                </CardContent>
              </Card>
              <Card className="bento__tile border-0 shadow-none rounded-none">
                <CardHeader className="p-0">
                  <CardTitle asChild><h3>Custom intake forms.</h3></CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p><span className="donna">donna</span> collects exactly what your firm needs. No account required.</p>
                </CardContent>
              </Card>
              <Card className="bento__tile border-0 shadow-none rounded-none">
                <CardHeader className="p-0">
                  <CardTitle asChild><h3>An MCP connector.</h3></CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p>Ask for matters, documents, records — right inside Claude or ChatGPT.</p>
                </CardContent>
              </Card>
              <Card className="bento__tile bento__tile--wide border-0 shadow-none rounded-none">
                <CardHeader className="p-0">
                  <CardTitle asChild><h3>Five systems, three assistants, one connector.</h3></CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ConnectionMap />
                </CardContent>
              </Card>
            </div>
          </FigureReveal>
        </div>
      </section>

      {/* ── stats band ───────────────────────────────────────────────── */}
      <section className="section section--tint section--top">
        <div className="section-in section-in--mid">
          <div className="section-head center">
            <h2><span className="donna">donna</span>, by the numbers.</h2>
          </div>
          <FigureReveal>
            <div className="stat-tiles">
              <BrandStatTile value={CONNECTS.pms} outOf={CONNECTS.pms} label="Practice management systems" />
              <BrandStatTile value={CONNECTS.assistants} outOf={CONNECTS.assistants} label="AI assistants" />
              <BrandBulletChart weeks={2} fromLabel="Signing" toLabel="Live" />
              <BrandGaugeRing value={24} unit="hours" label="to hear back — every time" />
            </div>
          </FigureReveal>
          <FigureReveal>
            <BrandStepFlow steps={STEPS} />
          </FigureReveal>
        </div>
      </section>

      {/* ── demo tabs ────────────────────────────────────────────────── */}
      <section className="section" id="demo">
        <div className="section-in section-in--mid">
          <div className="section-head center">
            <h2>See it work.</h2>
          </div>
          <FigureReveal>
            <Tabs defaultValue="intake" className="demo-tabs">
              <TabsList>
                <TabsTrigger value="intake">Intake</TabsTrigger>
                <TabsTrigger value="mcp">MCP</TabsTrigger>
              </TabsList>
              <TabsContent value="intake">
                <DemoVideo
                  src="/assets/video/donna-intake.mp4"
                  poster="/assets/video/donna-intake-poster.jpg"
                  caption="A client completes intake; the matter lands in the PMS."
                />
              </TabsContent>
              <TabsContent value="mcp">
                <DemoVideo
                  src="/assets/video/donna-mcp.mp4"
                  poster="/assets/video/donna-mcp-poster.jpg"
                  caption="Asking a practice management system questions in plain English."
                />
              </TabsContent>
            </Tabs>
          </FigureReveal>
          <FigureReveal>
            <figure className="figure figure--reel">
              <video
                src="/assets/video/process-reel.mp4"
                poster="/assets/video/process-reel-poster.png"
                muted
                playsInline
                autoPlay
                loop
                preload="metadata"
                aria-label="Client, donna, and your practice management system, in sequence"
              />
            </figure>
          </FigureReveal>
        </div>
      </section>

      {/* ── faq ──────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="section-in section-in--mid">
          <div className="section-head center">
            <h2>Questions.</h2>
          </div>
          <Accordion type="single" collapsible>
            {FAQ.map((f) => (
              <AccordionItem value={f.q} key={f.q} className="faq-item">
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── closing cta band ─────────────────────────────────────────── */}
      <section className="cta-band">
        <div className="section-in section-in--mid">
          <h2>Get <span className="donna">donna</span> for your firm.</h2>
          <div className="go">
            <Magnetic>
              <Button asChild size="lg" variant="secondary">
                <a href="#enquire">Send an enquiry</a>
              </Button>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* ── enquiry form ─────────────────────────────────────────────── */}
      <section className="section" id="enquire">
        <div className="section-in section-in--mid">
          <div className="section-head center">
            <h2>Tell us about your firm.</h2>
          </div>
          <FigureReveal>
            <EnquiryForm />
          </FigureReveal>
        </div>
      </section>
    </main>
  )
}
