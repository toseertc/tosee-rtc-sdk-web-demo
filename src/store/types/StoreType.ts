import { types } from 'mobx-state-tree'
import {
  VideoFitMode,
  VideoOptimizationMode,
} from 'ts-rtc-sdk-web'

const VideoPlayerConfig = types.model({
  mirror: types.boolean,
  fit: types.enumeration(Object.values(VideoFitMode)),
})

const VideoEncoderConfig = types.model({
  width: types.number,
  height: types.number,
  frameRate: types.number,
  bitrateMin: types.maybe(types.number),
  bitrateMax: types.maybe(types.number),
})

const VideoInitConfig = types.model({
  encoderConfig: VideoEncoderConfig,
  optimizationMode: types.enumeration(Object.values(VideoOptimizationMode)),
})

export {
  VideoPlayerConfig,
  VideoEncoderConfig,
  VideoInitConfig,
}
