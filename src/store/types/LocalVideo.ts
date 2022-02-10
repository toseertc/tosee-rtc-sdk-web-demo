/* eslint-disable no-param-reassign */
import {
  types,
} from 'mobx-state-tree'
import BaseType from './BaseType'

const LocalVideo = BaseType.named('LocalVideo').props({
  id: types.identifier,
  muted: types.maybeNull(types.boolean),
  firstFrameDecoded: false,
  createTrackError: '',
}).actions((self) => ({
  setMuted(muted: boolean) {
    self.muted = muted
  },
  setFirstFrameDecoded(decoded: boolean) {
    self.firstFrameDecoded = decoded
  },
  setCreateTrackError(err) {
    self.createTrackError = err
  },
}))
export default LocalVideo
