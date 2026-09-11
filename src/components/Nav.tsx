import { useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Magnetic } from '@/components/amicro/magnetic'
import { Button } from '@/components/ui/button'

const LINKS = [
  { to: '/#donna', label: 'donna', end: true },
  { to: '/blog', label: 'Blogs', end: false },
]

/** N1b canonical SaaS three-section — brand hard-left, a real <nav> holding
 *  only the two link destinations, sign-in/CTA hard-right outside the <nav>
 *  element (so hallmark_check.py gate 42's <nav>-scoped link count stays at
 *  2, not 4). Frosts past a small scroll threshold; transparent at rest. */
export default function Nav() {
  const ref = useRef<HTMLElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const header = ref.current
    if (!header) return
    let frame = 0
    const read = () => {
      frame = 0
      const scrolled = scrollY > 24
      header.classList.toggle('is-scrolled', scrolled)
      // Only Home opens on a dark hero; re-queried per route since Nav
      // persists across client-side navigation rather than remounting.
      const onDark = !scrolled && !!document.querySelector('.hero-dark')
      header.classList.toggle('nav--on-dark', onDark)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read) }
    read()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [pathname])

  // SSR/no-JS fallback: guess from the route before the effect above can
  // measure the real DOM (prerendering never runs effects at all, and a
  // slow JS visitor would otherwise see one dark-on-dark frame first).
  const initialClass = pathname === '/' ? 'nav nav--on-dark' : 'nav'

  return (
    <header className={initialClass} id="nav" ref={ref}>
      <div className="nav__inner">
        <Link className="nav__brand" to="/">jdot<i>ai</i></Link>
        <nav className="nav__center" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink key={l.to} className="nav__link" to={l.to} end={l.end}>{l.label}</NavLink>
          ))}
        </nav>
        <div className="nav__right">
          <Magnetic range={60} strength={0.25}>
            <Button asChild size="sm">
              <Link to="/contact">Contact us</Link>
            </Button>
          </Magnetic>
        </div>
      </div>
    </header>
  )
}
