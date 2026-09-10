import { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Frame from './components/Frame'
import Pill from './components/Pill'
import { initPageEffects } from './lib/effects'
import Home from './routes/Home'
// Home is in the main chunk — it is the landing page and must not wait on a
// second request. Everything else is split; the registry also exposes the
// importers so the prerenderer can resolve them before rendering.
import { Blog, Contact, Legal, NotFound, Post } from './routes/registry'

function usePageChrome() {
  const { pathname, hash } = useLocation()

  // Re-arm the observers after every navigation, and tear them down on the
  // way out so a long session doesn't accumulate listeners.
  useEffect(() => initPageEffects(), [pathname])

  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
}

export default function App() {
  usePageChrome()

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Frame />
      <Pill />
      <Suspense fallback={<div className="route-wait" aria-hidden="true" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  )
}
