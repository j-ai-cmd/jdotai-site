import EnquiryForm from '@/components/EnquiryForm'
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
          <h1>Tell us what your week looks like.</h1>
          <p className="lede">
            Which system you run on, and where the hours actually go. We read every enquiry and
            reply within 24 hours.
          </p>
        </div>
      </section>
      <section className="sec">
        <div className="in mid">
          <div className="formwrap">
            <div className="prose">
              <p>
                If you would rather just email,{' '}
                <a className="tlink" href="mailto:jai@jdotai.com">jai@jdotai.com</a> reaches the
                same place.
              </p>
            </div>
            <EnquiryForm variant="contact" />
          </div>
        </div>
      </section>
    </main>
  )
}
