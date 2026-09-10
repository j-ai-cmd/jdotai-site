import { Composition } from 'remotion'
import { TitleCard } from './TitleCard'
import { FPS, SIZE } from './brand'

export const RemotionRoot: React.FC = () => (
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
)
