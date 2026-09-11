import EnquiryForm from '@/components/EnquiryForm'
import { FadeUp } from '@/components/amicro/fade-up'
import { TextReveal } from '@/components/amicro/text-reveal'
import { useSeo } from '@/lib/seo'

const META = {
  title: 'Contact — jdotai',
  description:
    'Tell us which system you run on and where the hours go. We read every enquiry and reply within 24 hours.',
  path: '/contact',
} as const

export default function Contact() {
  useSeo(META)
  return (
    <main id="main">
      <section className="open">
        <div className="narrow">
          <TextReveal as="h1" text="Tell us what your week looks like." />
        </div>
      </section>

      <div className="essay">
        <FadeUp>
          <p className="lede">
            Which system you run on, and where the hours actually go. We read every enquiry and
            reply within 24 hours.
          </p>
          <p>
            If you would rather just email,{' '}
            <a className="cta-link" href="mailto:jai@jdotai.com">jai@jdotai.com</a> reaches the
            same place.
          </p>
        </FadeUp>
        <div className="figure">
          <EnquiryForm variant="contact" />
        </div>
      </div>
    </main>
  )
}
