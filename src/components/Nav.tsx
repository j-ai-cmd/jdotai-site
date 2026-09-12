import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const LINKS = [
  { to: '/', label: 'Product', end: true },
  { to: '/blog', label: 'Writing', end: false },
]

/** N10 scroll-morph. Transparent over the dark hero, then it takes on the
 *  paper background and inverts its text the moment the hero leaves. The
 *  read-progress hairline is drawn on the nav's own bottom edge rather than
 *  as a separate bar, so the page has one fixed element, not two. */
export default function Nav() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = ref.current
    if (!nav) return
    let frame = 0

    const read = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      nav.style.setProperty('--read', String(max > 0 ? Math.min(1, doc.scrollTop / max) : 0))

      // Solid once the dark hero is behind us. Measured against the hero's
      // real height rather than a magic number, so it stays right when the
      // hero copy changes length.
      const hero = document.querySelector('.hero')
      const cut = hero ? hero.getBoundingClientRect().bottom : 0
      nav.dataset.solid = String(cut <= nav.offsetHeight)
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
    <header className="nav" ref={ref} data-solid="false">
      <Link className="nav__wm" to="/">jdot<i>ai</i></Link>
      <nav className="nav__links" aria-label="Primary">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
        ))}
      </nav>
      {/* Outline, so it inherits the nav's currentColor and flips with it
          instead of needing a second set of colours for the dark state. */}
      <Button
        asChild
        size="sm"
        variant="outline"
        className="border-current bg-transparent text-current"
      >
        <a href="#start">Book a walkthrough</a>
      </Button>
      <i className="nav__read" aria-hidden="true" />
    </header>
  )
}
