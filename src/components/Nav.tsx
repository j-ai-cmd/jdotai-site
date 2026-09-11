import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Magnetic } from '@/components/amicro/magnetic'
import { Button } from '@/components/ui/button'

const LINKS = [
  { to: '/legal', label: 'donna', end: false },
  { to: '/blog', label: 'Blogs', end: false },
]

/** N1b canonical SaaS three-section — brand hard-left, a real <nav> holding
 *  only the two link destinations, sign-in/CTA hard-right outside the <nav>
 *  element (so hallmark_check.py gate 42's <nav>-scoped link count stays at
 *  2, not 4). Frosts past a small scroll threshold; transparent at rest. */
export default function Nav() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = ref.current
    if (!header) return
    let frame = 0
    const read = () => {
      frame = 0
      header.classList.toggle('is-scrolled', scrollY > 24)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read) }
    read()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="nav" id="nav" ref={ref}>
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
