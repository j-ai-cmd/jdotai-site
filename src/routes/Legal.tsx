import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Home from './Home'

/** donna's content now lives on the one-page Home — the user asked for a
 *  single dense page, not a second route for the same product. This route
 *  stays (rather than 404ing) for anyone with the old /legal link bookmarked
 *  or indexed.
 *
 *  It renders Home rather than <Navigate>, because <Navigate> on the initial
 *  render is a no-op under StaticRouter: the prerenderer wrote an empty page
 *  for /legal, so a crawler following an indexed link got nothing. Rendering
 *  the real content and redirecting after mount gives both audiences the
 *  right thing. The canonical in Home's head already points at "/", so this
 *  does not read as duplicate content.
 */
export default function Legal() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/', { replace: true })
  }, [navigate])

  return <Home />
}
