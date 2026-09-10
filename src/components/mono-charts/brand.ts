/** The three tokens.css colours, restated for recharts.
 *
 *  fill/stroke render as raw SVG attributes, not CSS, so a var(--wine)
 *  reference doesn't reliably resolve there. video/src/brand.ts hits the same
 *  wall for the same reason and duplicates the same way — if tokens.css
 *  changes, change both copies.
 */
export const CHART = {
  paper: '#FBFAF8',
  ink: '#171412',
  wine: '#6E2434',
  rule: '#E4DFDA', // color-mix(in oklab, ink 18%, paper), computed
  sunk: '#F5F3F0', // color-mix(in oklab, ink 4%, paper), computed
} as const
