import DemoVideo from '@/components/DemoVideo'
import { FadeUp } from '@/components/amicro/fade-up'
import { TextReveal } from '@/components/amicro/text-reveal'
import { useSeo } from '@/lib/seo'

const META = {
  title: 'jdotai — Bridging the gap between AI and legal',
  description:
    'jdotai builds custom tools, AI agents and automations for legal firms and helps them save 20+ hours every week.',
  path: '/',
} as const

export default function Home() {
  useSeo(META)

  return (
    <main id="main">
      <section className="open ask-q">
        <div className="narrow">
          <TextReveal as="h1" text="Which part of your week shouldn’t need a lawyer?" />
          <FadeUp delay={0.15}>
            <ul className="checks" id="checks">
              <li data-tick><span className="bx" aria-hidden="true" />Re-typing intake into the practice management system</li>
              <li data-tick><span className="bx" aria-hidden="true" />Chasing documents that never arrived</li>
              <li data-tick><span className="bx" aria-hidden="true" />Turning emails into tasks</li>
              <li><span className="bx" aria-hidden="true" />Advising the client</li>
              <li><span className="bx" aria-hidden="true" />Exercising judgment on the matter</li>
            </ul>
            <p className="lede after">
              The first three we automate. The last two are why you went to law school.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* The page used to claim "we build tools" and never show one. This is
          the first thing a reader sees working, above every argument for it. */}
      <section className="showreel" aria-labelledby="showreel-h">
        <div className="in mid">
          <h2 id="showreel-h">This is one we built.</h2>
          <video
            className="title-bumper"
            src="/assets/video/title-card.mp4"
            aria-hidden="true"
            muted
            playsInline
            autoPlay
            preload="metadata"
          />
          <DemoVideo
            className="showreel-frame"
            src="/assets/video/donna-hero-loop.mp4"
            poster="/assets/video/donna-hero-poster.jpg"
            caption="donna — a client completes intake, and the matter lands in the practice management system."
            ambient
          />
        </div>
      </section>

      <section className="stage" id="find">
        <div className="in wide">
          <h2>We find what drains you.</h2>
          <div className="sweep">
            <div className="prose">
              <p>We find the repetitive, manual work you and your team are too good to be doing.</p>
              <p>
                Between timekeeping, matter updates, document management, and client communication,
                hours disappear into administrative work. We uncover where, and what can be automated.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="stage" id="build">
        <div className="in wide">
          <h2>We build custom tools that match your workflow.</h2>
          <div className="sweep">
            <div className="prose">
              <p>An automation or agent that takes it on, wired into the tools you already use.</p>
              <p>
                We make sure the tool is built for how you and your team actually work, so it gets
                adopted at every level rather than sitting unused.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="tint" id="donna">
        <div className="in mid">
          <h2>Introducing <span className="donna">donna</span> for legal.</h2>
          <p className="lede donna-lede">donna does two things.</p>
          <dl className="pairs">
            <div data-rise>
              <dt>Custom intake forms</dt>
              <dd>
                Every missing answer creates another email, another call, and another delay. donna
                helps firms collect exactly what they need from the start.
              </dd>
            </div>
            <div data-rise>
              <dt>MCP connector</dt>
              <dd>
                Your firm&rsquo;s practice management system holds everything you need, but finding
                it still means clicking through matters, documents and records. donna lets you
                simply ask for what you need, right inside your Claude or ChatGPT account.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  )
}
