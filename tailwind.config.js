/** Tailwind is wired to the existing token block — it introduces no colour of
 *  its own. tokens.css stays the single source of truth, which is what keeps
 *  hallmark_check.py gate 48 ("no colour value outside the token block")
 *  decidable after the React port. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // site.css already carries a complete reset and every base element rule.
  // Preflight would overwrite them and silently undo the design system.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        wine: 'var(--wine)',
        'ink-body': 'var(--ink-body)',
        'ink-muted': 'var(--ink-muted)',
        'on-wine': 'var(--on-wine)',
        'on-ink': 'var(--on-ink)',
        rule: 'var(--rule)',
        sunk: 'var(--sunk)',
        'wine-hover': 'var(--wine-hover)',
      },
      fontFamily: {
        display: 'var(--fd)',
        body: 'var(--fb)',
        donna: 'var(--fd-donna)',
      },
      fontSize: {
        display: 'var(--t-display)',
        figure: 'var(--t-figure)',
        h2: 'var(--t-h2)',
        h3: 'var(--t-h3)',
        lede: 'var(--t-lede)',
      },
      maxWidth: { narrow: 'var(--w-narrow)', mid: 'var(--w-mid)', wide: 'var(--w-wide)' },
      borderRadius: { sm: 'var(--r-sm)', md: 'var(--r-md)', lg: 'var(--r-lg)' },
      transitionTimingFunction: { hallmark: 'var(--ease)' },
    },
  },
  plugins: [],
}
