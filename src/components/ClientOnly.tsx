import { useEffect, useState, type ReactNode } from 'react'

/** Renders `children` only after mount.
 *
 *  The prerenderer warms every lazy chunk before it renders, so the server
 *  emits the real charts and composer. The browser, at hydration time, has
 *  not loaded those chunks yet — it emits the Suspense fallback instead. The
 *  two trees disagree, React throws #418, discards the server HTML and the
 *  page loses every event handler on it.
 *
 *  Gating on mount makes both sides agree: server and first client render
 *  both produce `fallback`, and the real thing arrives on the second render.
 *  These blocks are an interactive dashboard and a video engine — neither
 *  belongs in prerendered HTML anyway.
 */
export default function ClientOnly({
  children,
  fallback = null,
}: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return <>{mounted ? children : fallback}</>
}
