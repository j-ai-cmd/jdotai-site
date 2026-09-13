import { Navigate } from 'react-router-dom'

/** donna has its own page at /donna. This route stays, rather than 404ing,
 *  for anyone with the old /legal link bookmarked or indexed — it was the
 *  donna URL for long enough to be worth honouring. */
export default function Legal() {
  return <Navigate to="/donna" replace />
}
