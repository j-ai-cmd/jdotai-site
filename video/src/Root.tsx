import { Composition } from 'remotion'
import { TitleCard } from './TitleCard'
import { TitleSequence } from './Sequence'
import { FPS, SIZE } from './brand'

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="TitleSequence"
      component={TitleSequence}
      durationInFrames={FPS * 4}
      fps={FPS}
      width={SIZE.width}
      height={SIZE.height}
    />
    <Composition
      id="TitleCard"
      component={TitleCard}
      durationInFrames={FPS * 4}
      fps={FPS}
      width={SIZE.width}
      height={SIZE.height}
      defaultProps={{ line: 'Two weeks.', accent: 'Then it runs.' }}
    />
  </>
)
