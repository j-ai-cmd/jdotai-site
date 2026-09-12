/** Mirrors the site's tokens.css. Remotion has no stylesheet to read them
 *  from, so the zinc scale is restated here and nowhere else. */
export const BRAND = {
  ink: '#0A0A0A',
  paper: '#FFFFFF',
  g400: '#A3A3A3',
  g500: '#757575',
  g800: '#212121',
  display: 'Inter Tight, system-ui, sans-serif',
  mono: 'JetBrains Mono, ui-monospace, monospace',
} as const

export const FPS = 30
export const SIZE = { width: 1280, height: 720 } as const
