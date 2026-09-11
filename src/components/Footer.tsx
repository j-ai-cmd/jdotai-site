import { Link } from 'react-router-dom'

/** Ft1 Mast-headed, simplified — studied from lex-ops.io's plain three-column
 *  close: brand, a couple of real destinations, contact. Replaces the
 *  earlier Ft5 Statement line, which read as filler once the rest of the
 *  page's copy got cut down. */
export default function Footer() {
  return (
    <footer className="foot-simple">
      <div className="section-in foot-simple__grid">
        <div>
          <span className="wm">jdot<i>ai</i></span>
          <p className="muted">AI tools for legal firms.</p>
        </div>
        <nav aria-label="Footer">
          <Link to="/blog">Blogs</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div>
          <a href="mailto:jai@jdotai.com">jai@jdotai.com</a>
          <a href="https://www.linkedin.com/in/jai-dhingra/" rel="noopener noreferrer" target="_blank">LinkedIn</a>
        </div>
      </div>
      <p className="foot-simple__cp">&copy; 2026 jdotai &mdash; Jai Dhingra</p>
    </footer>
  )
}
