import { Config } from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
// Matches the site's showreel frame; see src/styles/site.css .showreel-frame.
Config.setCodec('h264')
