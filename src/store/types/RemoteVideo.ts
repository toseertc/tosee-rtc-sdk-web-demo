/* eslint-disable no-param-reassign */
import {
  types,
} from 'mobx-state-tree'
import BaseType from './BaseType'

const RemoteVideo = BaseType.named('RemoteVideo').props({
  id: types.identifier,
  streamName: types.string,
  subscribing: types.maybeNull(types.boolean),
  isHD: types.boolean, // 流的真实状态，是否为大小流
  isHDSetting: types.boolean, // 设置项，是否切换到大流
  muted: types.boolean,
  user: types.model({
    uid: types.string,
  }),
  firstFrameDecoded: false,
}).actions((self) => ({
  setSubscribing(subscribing: boolean) {
    self.subscribing = subscribing
  },
  setMuted(muted: boolean) {
    self.muted = muted
  },
  setIsHD(isHD: boolean) {
    self.isHD = isHD
  },
  setIsHDSetting(isHDSetting: boolean) {
    self.isHDSetting = isHDSetting
  },
  setFirstFrameDecoded(decoded: boolean) {
    self.firstFrameDecoded = decoded
  },
}))

export default RemoteVideo
