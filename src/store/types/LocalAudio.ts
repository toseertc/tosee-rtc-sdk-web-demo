/* eslint-disable no-param-reassign */
import {
  types,
} from 'mobx-state-tree'
import BaseType from './BaseType'

const LocalAudio = BaseType.named('LocalAudio').props({
  id: types.identifier,
  muted: types.boolean,
  volume: types.number,
}).actions((self) => ({
  setVolume(volume: number) {
    self.volume = volume
  },
  setMuted(muted: boolean) {
    self.muted = muted
  },
}))
export default LocalAudio
