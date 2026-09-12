import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Easing } from 'remotion'
import { PerCharacterRise } from './components/remocn/per-character-rise'
import { SoftBlurIn } from './components/remocn/soft-blur-in'
import { BRAND, FPS } from './brand'

/** Monochrome title sequence, built from remocn primitives.
 *
 *  remocn components are `position:absolute; inset:0` and centre themselves,
 *  so each one gets its own band to fill rather than stacking. Their font is
 *  hardcoded to var(--font-geist-sans); defining that variable on the parent
 *  is the only way to brand them without editing the component.
 */
const Band: React.FC<{ h: number; children: React.ReactNode }> = ({ h, children }) => (
  <div style={{ position: 'relative', width: '100%', height: h }}>{children}</div>
)

/** A hairline that draws itself across the frame. */
const Rule: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame() - from
  const w = interpolate(f, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.22, 1, 0.36, 1),
  })
  return (
    <div style={{
      width: '52%', height: 1, background: BRAND.g500,
      transform: `scaleX(${w})`, transformOrigin: 'left', marginTop: 26,
    }} />
  )
}

export const TitleSequence: React.FC = () => (
  <AbsoluteFill style={{
    backgroundColor: BRAND.ink,
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    padding: '0 90px',
    ['--font-geist-sans' as string]: BRAND.display,
  }}>
    <Sequence layout="none" durationInFrames={FPS * 3}>
      <Band h={92}>
        <PerCharacterRise text="Ask your practice system" fontSize={62} color={BRAND.paper} fontWeight={600} />
      </Band>
    </Sequence>

    <Sequence layout="none" from={18} durationInFrames={FPS * 3}>
      <Band h={92}>
        <SoftBlurIn text="anything." fontSize={62} color={BRAND.g400} fontWeight={600} />
      </Band>
    </Sequence>

    <Sequence layout="none" from={40}>
      <Rule from={40} />
    </Sequence>
  </AbsoluteFill>
)
