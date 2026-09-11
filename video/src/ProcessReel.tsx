import { AbsoluteFill, Sequence } from 'remotion'
import { PerCharacterRise } from './components/remocn/per-character-rise'
import { BRAND } from './brand'

export type ProcessReelProps = {
  steps: string[]
}

const STEP_FRAMES = 50

/** The second real composition in this workspace — proves the pipeline
 *  handles a sequence, not just a single title card, and puts the unused
 *  per-character-rise component to work. Three real stages (the actual
 *  three steps donna's page describes), staged one after another rather
 *  than as three simultaneous divs, since Remotion's Sequence is the tool
 *  built for exactly this. */
export const ProcessReel: React.FC<ProcessReelProps> = ({ steps }) => (
  <AbsoluteFill style={{ backgroundColor: BRAND.paper }}>
    {steps.map((step, i) => (
      <Sequence key={step} from={i * STEP_FRAMES} durationInFrames={STEP_FRAMES}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 80,
            textAlign: 'center',
            ['--font-geist-sans' as string]: BRAND.display,
          }}
        >
          {/* PerCharacterRise is position:absolute;inset:0 internally (same
              trap TitleCard.tsx documents) — the counter needs its own band
              above it, not a flex sibling, or the two fight for the centre. */}
          <div style={{ position: 'relative', width: '100%', height: 40 }}>
            <span style={{ fontSize: 28, color: BRAND.wine, fontFamily: BRAND.display, fontWeight: 600 }}>
              {i + 1} / {steps.length}
            </span>
          </div>
          <div style={{ position: 'relative', width: '100%', height: 90 }}>
            <PerCharacterRise text={step} fontSize={48} color={BRAND.ink} fontWeight={600} />
          </div>
        </AbsoluteFill>
      </Sequence>
    ))}
  </AbsoluteFill>
)
