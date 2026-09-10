/** The static build's site.js, made re-runnable.
 *
 *  Every behaviour here is DOM-driven and query-based, which survives the port
 *  unchanged — the only real difference is that a SPA has to re-arm it after
 *  each navigation and tear it down on unmount. initPageEffects() returns its
 *  own cleanup so a route change can't leak observers or listeners.
 *
 *  Deliberately not ported: the post-list renderer (React owns that now).
 */

const REDUCED = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

export function initPageEffects(): () => void {
  const reduced = REDUCED()
  const hasIO = typeof IntersectionObserver !== 'undefined'
  const teardown: Array<() => void> = []

  const on = <K extends keyof WindowEventMap>(
    type: K,
    fn: (e: WindowEventMap[K]) => void,
    opts?: AddEventListenerOptions,
  ) => {
    addEventListener(type, fn, opts)
    teardown.push(() => removeEventListener(type, fn, opts))
  }

  /* ── stages: a pinned heading activates as its section takes the screen ──
     The class is `live`, not `on` — `.js .stage.live .sweep::after` is what
     retracts the paper overlay, so any other name leaves the prose covered. */
  const stages = Array.from(document.querySelectorAll<HTMLElement>('.stage'))
  if (stages.length) {
    // Correctness backstop: only reveals a stage the reader has actually
    // reached, so it cannot flatten the effect the way a blanket timeout does.
    const revealVisible = () => {
      const h = innerHeight || document.documentElement.clientHeight
      stages.forEach((s) => {
        if (s.classList.contains('live')) return
        const r = s.getBoundingClientRect()
        if (r.top < h * 0.85 && r.bottom > 0) s.classList.add('live')
      })
    }
    if (hasIO) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            e.target.classList.add('live')
            io.unobserve(e.target)
          }),
        { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
      )
      stages.forEach((s) => io.observe(s))
      teardown.push(() => io.disconnect())
    }
    let pending = false
    const onScroll = () => {
      if (pending) return
      pending = true
      requestAnimationFrame(() => { revealVisible(); pending = false })
    }
    on('scroll', onScroll, { passive: true })
    on('resize', onScroll, { passive: true })
    revealVisible()
  }

  /* ── the question hero: the first three tick, the last two never do ───── */
  const ticks = Array.from(document.querySelectorAll<HTMLElement>('#checks [data-tick]'))
  if (ticks.length) {
    if (reduced) {
      ticks.forEach((li) => li.classList.add('on'))
    } else {
      ticks.forEach((li, i) => {
        const id = setTimeout(() => li.classList.add('on'), 500 + i * 380)
        teardown.push(() => clearTimeout(id))
      })
    }
  }

  /* ── generic entrances ────────────────────────────────────────────────── */
  const risers = Array.from(document.querySelectorAll<HTMLElement>('[data-rise]'))
  if (risers.length) {
    if (!hasIO) {
      risers.forEach((el) => el.classList.add('shown'))
    } else {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            e.target.classList.add('shown')
            io.unobserve(e.target)
          }),
        { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
      )
      risers.forEach((el) => io.observe(el))
      teardown.push(() => io.disconnect())

      // Never leave content stranded if the observer misses a fast scroll.
      on('scroll', () => {
        const h = innerHeight || document.documentElement.clientHeight
        risers.forEach((el) => {
          if (el.classList.contains('shown')) return
          const r = el.getBoundingClientRect()
          if (r.top < h * 0.9 && r.bottom > 0) el.classList.add('shown')
        })
      }, { passive: true })
    }
  }

  return () => teardown.forEach((fn) => fn())
}

/** The typed ask-line on the donna page. Separate because it owns a caret node
 *  and a self-scheduling loop that has to be cancellable. */
export function initAskLine(el: HTMLElement, questions: string[]): () => void {
  const caret = document.createElement('span')
  caret.className = 'caret'
  caret.setAttribute('aria-hidden', 'true')
  const text = document.createTextNode('')
  el.replaceChildren(text, caret)

  if (REDUCED()) {
    text.data = questions[0]
    return () => el.replaceChildren()
  }

  let timer: ReturnType<typeof setTimeout>
  let stopped = false
  const type = () => {
    let qi = 0
    let ci = 0
    let deleting = false
    const step = () => {
      if (stopped) return
      const full = questions[qi]
      ci += deleting ? -1 : 1
      text.data = full.slice(0, ci)
      let wait = deleting ? 22 : 42
      if (!deleting && ci === full.length) { deleting = true; wait = 2100 }
      else if (deleting && ci === 0) { deleting = false; qi = (qi + 1) % questions.length; wait = 320 }
      timer = setTimeout(step, wait)
    }
    step()
  }

  let onVisible: (() => void) | undefined
  if (document.visibilityState === 'visible') {
    type()
  } else {
    // Opened in a background tab — show the first question, start on look.
    text.data = questions[0]
    onVisible = () => {
      if (document.visibilityState !== 'visible') return
      document.removeEventListener('visibilitychange', onVisible!)
      text.data = ''
      type()
    }
    document.addEventListener('visibilitychange', onVisible)
  }

  return () => {
    stopped = true
    clearTimeout(timer)
    if (onVisible) document.removeEventListener('visibilitychange', onVisible)
    el.replaceChildren()
  }
}
