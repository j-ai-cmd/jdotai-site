import { Link } from 'react-router-dom'

/** Ft4 colophon — a wordmark, two real destinations and a contact line.
 *  Deliberately not a link column: four <a> inside one <nav> is the shape
 *  gate 42 fails, and this footer has never had four destinations. */
export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__grid">
        <span className="nav__wm">jdot<i>ai</i></span>
        <nav aria-label="Footer">
          <Link to="/blog">Writing</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <a href="mailto:jai@jdotai.com" className="mono">jai@jdotai.com</a>
        <span className="foot__cp">© 2026 jdotai</span>
      </div>
    </footer>
  )
}
