/* eslint-disable no-param-reassign */
import {
  types,
} from 'mobx-state-tree'
import BaseType from './BaseType'

const RemoteAudio = BaseType.named('RemoteAudio').props({
  id: types.identifier,
  volume: types.number,
  subscribing: false,
  muted: false,
  user: types.model({
    uid: types.string,
  }),
}).actions((self) => ({
  setVolume(volume: number) {
    self.volume = volume
  },
  setSubscribing(subscribing: boolean) {
    self.subscribing = subscribing
  },
  setMuted(muted: boolean) {
    self.muted = muted
  },
}))

export default RemoteAudio
