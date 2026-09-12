/** The tokens.css colours, restated for recharts.
 *
 *  fill/stroke render as raw SVG attributes, not CSS, so a var(--wine)
 *  reference doesn't reliably resolve there — and the prerenderer paints
 *  these during renderToString, where no stylesheet exists at all.
 *  video/src/brand.ts hits the same wall for the same reason and duplicates
 *  the same way — if tokens.css changes, change both copies.
 *
 *  Every value here is achromatic (R = G = B), matching the token block.
 */
export const CHART = {
  paper: '#FAFAFA',
  ink: '#0A0A0A',
  wine: '#262626',
  rule: '#D6D6D6', // color-mix(in oklab, ink 18%, paper), computed
  sunk: '#F2F2F2', // color-mix(in oklab, ink 4%, paper), computed
} as const
