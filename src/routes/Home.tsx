import { lazy, Suspense } from 'react'
import ClientOnly from '@/components/ClientOnly'
import EnquiryForm from '@/components/EnquiryForm'
import Rig from '@/components/Rig'
import ScrollFilm from '@/components/ScrollFilm'
import { FadeUp } from '@/components/amicro/fade-up'
import { TextReveal } from '@/components/amicro/text-reveal'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSeo } from '@/lib/seo'

// The WebCodecs engine is a megabyte; it loads when the reader reaches it.
const Composer = lazy(() => import('@/components/Composer'))

const META = {
  title: 'jdotai — donna',
  description:
    'donna connects your practice management system to Claude and ChatGPT, and takes intake off your desk.',
  path: '/',
} as const

// The film is a Remotion title (rendered from remocn primitives) spliced in
// front of the product recording, so the first quarter of the scrub is the
// title and the rest is the tool.
const CHAPTERS = [
  { at: 0, label: '' },
  { at: 0.27, label: 'Client opens the link' },
  { at: 0.48, label: 'Answers at their own pace' },
  { at: 0.7, label: 'Fields map to your system' },
  { at: 0.88, label: 'Matter exists' },
]

const STACK = ['Clio', 'Smokeball', 'Actionstep', 'myCase', 'LEAP', 'Claude', 'ChatGPT', 'Kimi', 'MCP']

const STEPS: [string, string, string][] = [
  ['01', 'Map', 'Your existing forms, your field names, your matter types.'],
  ['02', 'Wire', 'donna connects. We confirm every field lands where you expect.'],
  ['03', 'Live', 'You send a link. Matters arrive structured.'],
]

const FAQ: [string, string][] = [
  ['Which systems?', 'Clio, Smokeball, Actionstep, myCase and LEAP. Ask if yours is missing.'],
  ['How long?', 'Two weeks from signing.'],
  ['Client accounts?', 'None. They get a link and their progress saves.'],
  ['Where does the AI run?', 'Inside your own Claude or ChatGPT account, over MCP.'],
]

export default function Home() {
  useSeo(META)

  return (
    <main id="main">
      {/* ── hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="wrap">
          <TextReveal as="h1" text={'Ask your\npractice system\nanything.'} />
          <FadeUp delay={0.2}>
            <p className="hero__lede">
              donna takes intake off your desk and puts your matters inside Claude.
            </p>
            <div className="hero__go">
              <Button asChild size="lg"><a href="#start">Book a walkthrough</a></Button>
              <Button asChild size="lg" variant="outline">
                <a href="#rig">See the data</a>
              </Button>
            </div>
            <div className="hero__meta">
              <div><span className="n">5</span><span className="l">practice systems</span></div>
              <div><span className="n">3</span><span className="l">assistants</span></div>
              <div><span className="n">2</span><span className="l">weeks to live</span></div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── scroll-scrubbed film ─────────────────────────────── */}
      <ScrollFilm
        src="/assets/video/film.mp4"
        poster="/assets/video/film-poster.jpg"
        chapters={CHAPTERS}
        scrollLength={4}
      />

      {/* ── marquee ──────────────────────────────────────────── */}
      <div className="marq" aria-label="Connects to">
        <div className="marq__row">
          {[...STACK, ...STACK].map((s, i) => <span key={`${s}-${i}`}>{s}</span>)}
        </div>
      </div>

      {/* ── the instrument grid ──────────────────────────────── */}
      <section className="band band--loose" id="rig">
        <div className="wrap">
          <div className="head" data-rise>
            <span className="tag">The dashboard</span>
            <h2>Every submission, as a number.</h2>
            <p>Shape shown on sample data — your figures replace it on day one.</p>
          </div>
          <ClientOnly fallback={<div className="rig-wait" aria-hidden="true" />}>
            <Rig />
          </ClientOnly>
        </div>
      </section>

      {/* ── in-browser composer ──────────────────────────────── */}
      <section className="band band--loose band-dark">
        <div className="wrap">
          <div className="head" data-rise>
            <span className="tag">Runs on your machine</span>
            <h2>Type. Watch it recompose.</h2>
            <p>WebCodecs and your GPU. Nothing uploads.</p>
          </div>
          <ClientOnly fallback={<div className="comp-wait" aria-hidden="true" />}>
            <Suspense fallback={<div className="comp-wait" aria-hidden="true" />}>
              <Composer />
            </Suspense>
          </ClientOnly>
        </div>
      </section>

      {/* ── demos ────────────────────────────────────────────── */}
      <section className="band band--loose band-tint" id="demo">
        <div className="wrap wrap--mid">
          <div className="head" data-rise>
            <span className="tag">Recorded</span>
            <h2>Both halves, working.</h2>
          </div>
          <Tabs defaultValue="intake">
            <TabsList>
              <TabsTrigger value="intake">Intake</TabsTrigger>
              <TabsTrigger value="mcp">Connector</TabsTrigger>
            </TabsList>
            <TabsContent value="intake">
              <video
                src="/assets/video/donna-intake-mono.mp4"
                poster="/assets/video/donna-intake-mono-poster.jpg"
                controls preload="metadata" playsInline
                style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--line)' }}
              />
            </TabsContent>
            <TabsContent value="mcp">
              <video
                src="/assets/video/donna-mcp-mono.mp4"
                poster="/assets/video/donna-mcp-mono-poster.jpg"
                controls preload="metadata" playsInline
                style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--line)' }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* ── steps ────────────────────────────────────────────── */}
      <section className="band band--loose">
        <div className="wrap wrap--mid">
          <div className="head" data-rise><h2>Three moves.</h2></div>
          <div className="steps">
            {STEPS.map(([n, t, b]) => (
              <div key={n} data-rise>
                <span className="n">{n}</span>
                <div><h3>{t}</h3><p>{b}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── faq ──────────────────────────────────────────────── */}
      <section className="band band--mid band-tint">
        <div className="wrap wrap--narrow">
          <div className="head" data-rise><h2>Questions.</h2></div>
          <Accordion type="single" collapsible>
            {FAQ.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── close ────────────────────────────────────────────── */}
      <section className="close" id="start">
        <div className="wrap wrap--mid">
          <h2 data-rise>Two weeks. Then it runs.</h2>
          <div style={{ marginTop: '2.5rem', maxWidth: '34rem' }}>
            <EnquiryForm variant="contact" />
          </div>
        </div>
      </section>
    </main>
  )
}
