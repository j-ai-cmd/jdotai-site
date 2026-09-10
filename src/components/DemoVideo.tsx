import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  poster: string
  caption?: string
  /** Ambient loops autoplay muted and carry no controls; a demo the reader
   *  chooses to watch gets real controls and sound. */
  ambient?: boolean
  className?: string
}

/** One video component for both jobs. The poster is non-negotiable — without
 *  it the highest-intent element on the page renders as an empty box until
 *  someone clicks it, which is exactly what the old build shipped. */
export default function DemoVideo({ src, poster, caption, ambient = false, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (!ambient) return
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [ambient])

  useEffect(() => {
    const el = ref.current
    if (!el || !ambient) return
    if (reduced) { el.pause(); return }

    // Only play while on screen — an offscreen loop is wasted battery.
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) void el.play().catch(() => {}); else el.pause() },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ambient, reduced])

  const video = (
    <video
      ref={ref}
      src={src}
      poster={poster}
      preload="metadata"
      playsInline
      {...(ambient
        ? { muted: true, loop: true, autoPlay: !reduced, controls: reduced, 'aria-label': caption }
        : { controls: true })}
    />
  )

  if (!caption) return <div className={className}>{video}</div>
  return (
    <figure className={className}>
      {video}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
