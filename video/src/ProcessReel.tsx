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
            padding: 40,
            textAlign: 'center',
            ['--font-geist-sans' as string]: BRAND.display,
          }}
        >
          {/* Sized for how this actually ships — embedded at ~28rem wide on
              the page, not viewed at the composition's native 1100px. Small
              type here reads fine in the Remotion preview and as illegible
              specks once scaled down on the page. */}
          {/* PerCharacterRise is position:absolute;inset:0 internally (same
              trap TitleCard.tsx documents) — the counter needs its own band
              above it, not a flex sibling, or the two fight for the centre. */}
          <div style={{ position: 'relative', width: '100%', height: 64 }}>
            <span style={{ fontSize: 44, color: BRAND.g400, fontFamily: BRAND.display, fontWeight: 600 }}>
              {i + 1} / {steps.length}
            </span>
          </div>
          <div style={{ position: 'relative', width: '100%', height: 140 }}>
            <PerCharacterRise text={step} fontSize={66} color={BRAND.ink} fontWeight={600} />
          </div>
        </AbsoluteFill>
      </Sequence>
    ))}
  </AbsoluteFill>
)
