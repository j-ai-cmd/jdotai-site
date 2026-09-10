/** Ft4 colophon. Deliberately not four link columns + a social row — that
 *  shape is what hallmark_check.py gate 43 fails the build for. */
export default function Footer() {
  return (
    <footer className="foot">
      <div className="in wide">
        <div>
          <div className="mark">jdot<i>ai</i></div>
          <div className="tag">AI tools and automations for legal firms</div>
        </div>
        <div className="right">
          <a href="mailto:jai@jdotai.com">jai@jdotai.com</a>
          <a
            href="https://www.linkedin.com/in/jai-dhingra/"
            rel="noopener noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
          <span className="cp">&copy; 2026 jdotai &mdash; Jai Dhingra</span>
        </div>
      </div>
    </footer>
  )
}
