import { Link } from 'react-router-dom'
import DemoVideo from '@/components/DemoVideo'
import { FadeUp } from '@/components/amicro/fade-up'
import { FigureReveal } from '@/components/amicro/figure-reveal'
import { TextReveal } from '@/components/amicro/text-reveal'
import { Separator } from '@/components/ui/separator'
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
      <section className="open">
        <div className="narrow">
          <TextReveal as="h1" text="Which part of your week shouldn’t need a lawyer?" />
        </div>
      </section>

      <div className="essay">
        <FadeUp>
          <p className="lede">
            Re-typing intake into the practice management system. Chasing documents that never
            arrived. Turning emails into tasks. None of that needed the seven years of training
            it took to get your name on the letterhead — and none of it is why a client called
            you in the first place.
          </p>
          <p>
            Advising the client and exercising judgment on the matter are why you went to law
            school. We automate the first three. We do not touch the last two.
          </p>
        </FadeUp>

        <FigureReveal>
          <DemoVideo
            className="figure"
            src="/assets/video/donna-hero-loop.mp4"
            poster="/assets/video/donna-hero-poster.jpg"
            caption="donna — a client completes intake, and the matter lands in the practice management system."
            ambient
          />
        </FigureReveal>

        <h2>We find what drains you.</h2>
        <p>
          We find the repetitive, manual work you and your team are too good to be doing. Between
          timekeeping, matter updates, document management, and client communication, hours
          disappear into administrative work. We uncover where, and what can be automated.
        </p>

        <h2>We build custom tools that match your workflow.</h2>
        <p>
          An automation or agent that takes it on, wired into the tools you already use. We make
          sure the tool is built for how you and your team actually work, so it gets adopted at
          every level rather than sitting unused.
        </p>

        <Separator className="ornament" />

        <h2>Introducing <span className="donna">donna</span> for legal.</h2>
        <p>
          <span className="donna">donna</span> does two things. Custom intake forms collect
          exactly what your firm needs from the start, so every missing answer doesn't become
          another email, another call, another delay. And an MCP connector lets you simply ask
          for what you need — matters, documents, records — right inside your Claude or ChatGPT
          account, instead of clicking through your practice management system to find it.
        </p>
        <p>
          <Link className="cta-link" to="/legal">Read how donna works, in detail →</Link>
        </p>
      </div>
    </main>
  )
}
