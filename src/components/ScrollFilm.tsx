import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  poster: string
  /** Marks shown along the scrub bar; the label swaps as you pass each one. */
  chapters: { at: number; label: string }[]
  /** How many viewport heights the film is scrubbed across. */
  scrollLength?: number
}

/** The film scrubs on scroll: the section is tall, the frame is sticky, and
 *  the video's currentTime is driven by how far through that tall section the
 *  reader is. No autoplay, no controls, no clicking — moving the page moves
 *  the footage. It is the one interaction the whole page is built around.
 *
 *  Falls back to a plain poster + controls when the reader prefers reduced
 *  motion, since scroll-hijacked time is exactly what that setting is for.
 */
export default function ScrollFilm({ src, poster, chapters, scrollLength = 3 }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = useState(chapters[0]?.label ?? '')
  const [reduced, setReduced] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced) return
    const el = wrap.current
    const v = video.current
    if (!el || !v) return

    let frame = 0
    let target = 0

    const measure = () => {
      frame = 0
      const box = el.getBoundingClientRect()
      const travel = box.height - innerHeight
      const p = travel > 0 ? Math.min(1, Math.max(0, -box.top / travel)) : 0

      bar.current?.style.setProperty('--p', String(p))
      if (v.duration) target = p * v.duration

      const hit = [...chapters].reverse().find((c) => p >= c.at)
      if (hit) setChapter(hit.label)
    }

    // Seeking every scroll event stutters; easing toward the target in a
    // single rAF loop keeps it smooth without queueing seeks.
    let raf = 0
    const tick = () => {
      if (v.readyState >= 2 && Number.isFinite(target)) {
        const delta = target - v.currentTime
        if (Math.abs(delta) > 0.01) v.currentTime += delta * 0.18
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure) }
    measure()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
      cancelAnimationFrame(raf)
    }
  }, [chapters, reduced])

  return (
    <section
      className="film"
      ref={wrap}
      style={reduced ? undefined : { height: `${scrollLength * 100}svh` }}
      aria-label="Product walkthrough"
    >
      <div className="film__sticky">
        <div className="film__inner">
          <video
            ref={video}
            src={src}
            poster={poster}
            muted
            playsInline
            preload="auto"
            controls={reduced}
            onLoadedData={() => setReady(true)}
          />
          <div className="film__cap">
            <span>{chapter}</span>
            <span>{ready ? (reduced ? 'press play' : 'scroll to play') : 'loading'}</span>
          </div>
          <div className="film__bar" ref={bar}><i /></div>
        </div>
      </div>
    </section>
  )
}
