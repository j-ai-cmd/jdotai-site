import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/legal', label: 'Legal', end: false },
  { to: '/blog', label: 'Blogs', end: false },
]

/** N5 floating pill. Two behaviours carried over from the static build:
 *  a --read scroll-progress fill, and inversion over dark bands. Both are
 *  driven from one rAF-throttled scroll listener. */
export default function Pill() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const pill = ref.current
    if (!pill) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const read = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      pill.style.setProperty('--read', String(max > 0 ? Math.min(1, doc.scrollTop / max) : 0))

      // Invert when the pill's midline sits over a dark band.
      const box = pill.getBoundingClientRect()
      const mid = box.top + box.height / 2
      const dark = document.elementsFromPoint(box.left + box.width / 2, mid).some(
        (el) => el !== pill && !pill.contains(el) && el.matches?.('.foot, .band, .tint-dark, [data-dark]'),
      )
      pill.classList.toggle('over-dark', dark)
    }

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read) }
    read()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header className="pill" id="pill" ref={ref}>
      <Link className="wm" to="/">jdot<i>ai</i></Link>
      {/* NavLink sets aria-current="page" when active, which is exactly what
          `.pill .links a[aria-current]` already styles. */}
      <nav className="links" aria-label="Primary">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
        ))}
      </nav>
      <Link className="btn btn--sm" to="/contact">Contact us</Link>
    </header>
  )
}
