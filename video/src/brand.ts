/** The same three colours as the website's tokens.css, restated here because
 *  a Remotion render has no stylesheet to read them from. If tokens.css
 *  changes, change these too — they are the only duplication in the system. */
export const BRAND = {
  paper: '#FBFAF8',
  ink: '#171412',
  wine: '#6E2434',
  display: 'Libre Franklin, system-ui, sans-serif',
  body: 'Lora, Georgia, serif',
} as const

export const FPS = 30
export const SIZE = { width: 1100, height: 619 } as const
