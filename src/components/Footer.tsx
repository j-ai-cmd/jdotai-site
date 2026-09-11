import { CharacterEmphasis } from '@/components/amicro/character-emphasis'

/** Ft5 Statement — a closing line rather than a sitemap. The one
 *  CharacterEmphasis moment on the page; it shows on every route, so it
 *  can't compete with a second use elsewhere. */
export default function Footer() {
  return (
    <footer className="foot-stmt">
      <p className="foot-stmt__line">
        <CharacterEmphasis text="The week you went to law school for." />
      </p>
      <div className="foot-stmt__meta">
        <span className="wm">jdot<i>ai</i></span>
        <div className="foot-stmt__links">
          <a href="mailto:jai@jdotai.com">jai@jdotai.com</a>
          <a href="https://www.linkedin.com/in/jai-dhingra/" rel="noopener noreferrer" target="_blank">LinkedIn</a>
        </div>
        <span className="muted">&copy; 2026 jdotai &mdash; Jai Dhingra</span>
      </div>
    </footer>
  )
}
