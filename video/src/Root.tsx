import { Composition } from 'remotion'
import { TitleCard } from './TitleCard'
import { ProcessReel } from './ProcessReel'
import { FPS, SIZE } from './brand'

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="TitleCard"
      component={TitleCard}
      durationInFrames={FPS * 4}
      fps={FPS}
      width={SIZE.width}
      height={SIZE.height}
      defaultProps={{
        line: 'jdotai',
        accent: 'AI for legal.',
      }}
    />
    <Composition
      id="ProcessReel"
      component={ProcessReel}
      durationInFrames={50 * 3}
      fps={FPS}
      width={SIZE.width}
      height={SIZE.height}
      defaultProps={{
        steps: ['We map your intake', 'We wire your system', 'You go live'],
      }}
    />
  </>
)
