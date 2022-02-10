import { types } from 'mobx-state-tree'
import { DeviceID } from '../../const'
import BaseType from './BaseType'
import {
  VideoInitConfig, VideoPlayerConfig,
} from './StoreType'

const SettingsStore = BaseType.props({
  defaultVideoPlayerConfig: VideoPlayerConfig,
  videoInitConfig1: VideoInitConfig,
  micId: types.union(types.string, types.enumeration(Object.values(DeviceID))),
  cameraId: types.union(types.string, types.enumeration(Object.values(DeviceID))),
})

export default SettingsStore
