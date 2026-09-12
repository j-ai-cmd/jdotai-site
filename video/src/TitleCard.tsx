import { AbsoluteFill } from 'remotion'
import { SoftBlurIn } from './components/remocn/soft-blur-in'
import { BRAND } from './brand'

export type TitleCardProps = {
  line: string
  accent?: string
}

/** A branded title card, in the site's own three colours.
 *
 *  This exists to prove the pipeline end to end: remocn component → Remotion
 *  render → .mp4 → ../public/assets/video/. Replace the copy, re-render, and
 *  the site's showreel updates without anyone opening a screen recorder.
 *
 *  Two things the remocn component makes you work around:
 *
 *  1. It is `position:absolute; inset:0` and centres itself, so two of them
 *     stack on top of each other. Each one needs its own relatively-positioned
 *     band to fill.
 *  2. Its font-family is hardcoded to `var(--font-geist-sans)` with a system
 *     fallback, and it takes no font prop. Defining that variable on the
 *     parent is the only way to brand it without editing the component.
 */
const Band: React.FC<{ height: number; children: React.ReactNode }> = ({ height, children }) => (
  <div style={{ position: 'relative', width: '100%', height }}>{children}</div>
)

export const TitleCard: React.FC<TitleCardProps> = ({ line, accent }) => (
  <AbsoluteFill
    style={{
      backgroundColor: BRAND.ink,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 80,
      textAlign: 'center',
      ['--font-geist-sans' as string]: BRAND.display,
    }}
  >
    <Band height={86}>
      <SoftBlurIn text={line} fontSize={62} color={BRAND.paper} fontWeight={600} />
    </Band>
    {accent ? (
      <Band height={86}>
        <SoftBlurIn text={accent} fontSize={62} color={BRAND.g400} fontWeight={600} speed={0.85} />
      </Band>
    ) : null}
  </AbsoluteFill>
)
