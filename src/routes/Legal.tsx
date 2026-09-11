import { Navigate } from 'react-router-dom'

/** donna's content now lives on the one-page Home — the user asked for a
 *  single dense page, not a second route for the same product. This route
 *  stays (rather than 404ing) for anyone with the old /legal link bookmarked
 *  or indexed. */
export default function Legal() {
  return <Navigate to="/" replace />
}
