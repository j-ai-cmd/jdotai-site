import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

/** A real Diffusion Studio composition, mounted live in the page.
 *
 *  Everything here runs on the visitor's own machine — WebCodecs decodes and
 *  the GPU composites; nothing is uploaded and there is no server in the
 *  loop. Typing in the field rebuilds the clip and the canvas updates.
 *
 *  The engine is loaded lazily on first view: it is ~1 MB and has no business
 *  being in the bundle a reader downloads to read the hero.
 */
export default function Composer() {
  const stage = useRef<HTMLDivElement>(null)
  const comp = useRef<any>(null)
  const track = useRef<HTMLDivElement>(null)

  const [line, setLine] = useState('Matters, answered in plain English.')
  const [seconds, setSeconds] = useState(4)
  const [status, setStatus] = useState('Engine idle — scroll into view to load.')
  const [playing, setPlaying] = useState(false)
  const [loaded, setLoaded] = useState(false)

  /** Rebuild the composition from current state. */
  const build = useCallback(async (text: string, dur: number) => {
    const mod = await import('@diffusionstudio/core')
    const { Composition, Layer, TextClip } = mod as any
    const el = stage.current
    if (!el) return

    comp.current?.unmount?.()
    const composition = new Composition({ width: 1280, height: 720, background: '#09090B' })
    composition.mount(el)

    const layer = await composition.add(new Layer())
    await layer.add(
      new TextClip({
        text,
        start: 0,
        stop: Math.round(dur * 30),
        x: 80,
        y: 290,
        // 44 keeps a full sentence on two lines inside 1280x720; 68 pushed
        // the second line past the bottom of the frame.
        fontSize: 44,
        fillStyle: '#FFFFFF',
        maxWidth: 1120,
      }),
    )
    comp.current = composition
    return composition
  }, [])

  // Lazy-load on first intersection.
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting || loaded) return
      io.disconnect()
      setStatus('Loading WebCodecs engine…')
      try {
        await build(line, seconds)
        setLoaded(true)
        setStatus('Ready. Everything below runs on your machine.')
      } catch (err) {
        setStatus(`Engine unavailable in this browser — ${(err as Error).message.slice(0, 60)}`)
      }
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [build, line, seconds, loaded])

  const rebuild = useCallback(async () => {
    if (!loaded) return
    setPlaying(false)
    setStatus('Recomposing…')
    await build(line, seconds)
    setStatus('Recomposed. No upload, no round trip.')
  }, [build, line, seconds, loaded])

  const toggle = useCallback(async () => {
    const c = comp.current
    if (!c) return
    if (playing) { await c.pause(); setPlaying(false); return }
    await c.seek(0)
    await c.play()
    setPlaying(true)
    setStatus('Playing — decoded and composited locally.')
  }, [playing])

  return (
    <div className="comp">
      <div className="comp__stage" ref={stage} aria-label="Live video composition" />
      <div className="comp__side">
        <div className="comp__row">
          <label htmlFor="comp-line">Headline</label>
          <Input
            id="comp-line"
            value={line}
            onChange={(e) => setLine(e.target.value)}
            onBlur={rebuild}
           
          />
        </div>
        <div className="comp__row">
          <label htmlFor="comp-dur">Duration · {seconds}s</label>
          <Slider
            id="comp-dur"
            min={2}
            max={8}
            step={1}
            value={[seconds]}
            onValueChange={([v]) => setSeconds(v)}
            onValueCommit={rebuild}
          />
        </div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <Button size="sm" onClick={toggle} disabled={!loaded}>
            {playing ? 'Pause' : 'Play'}
          </Button>
          <Button size="sm" variant="outline" onClick={rebuild} disabled={!loaded}
           >
            Recompose
          </Button>
        </div>
        <p className="comp__status">{status}</p>
        <div className="comp__track" ref={track}><i /></div>
      </div>
    </div>
  )
}
