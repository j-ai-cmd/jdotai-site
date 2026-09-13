/** The tokens.css colours, restated for recharts.
 *
 *  fill/stroke render as raw SVG attributes, not CSS, so a var(--wine)
 *  reference doesn't reliably resolve there — and the prerenderer paints
 *  these during renderToString, where no stylesheet exists at all.
 *  video/src/brand.ts hits the same wall for the same reason and duplicates
 *  the same way — if tokens.css changes, change both copies.
 *
 *  The structural values are the token block's warm neutrals. wine is the one
 *  accent and is reserved for the series that goes the right way.
 */
export const CHART = {
  paper: '#F7F4EE',
  ink: '#16130F',
  wine: '#7A2E3B',
  muted: '#6B6864', // color-mix(in oklab, ink 62%, paper), computed — axis labels
  rule: '#CECBC5', // color-mix(in oklab, ink 18%, paper), computed
  sunk: '#EEEBE5', // color-mix(in oklab, ink 4%, paper), computed
} as const
