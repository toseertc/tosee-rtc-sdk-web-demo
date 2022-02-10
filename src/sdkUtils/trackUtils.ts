import _ from 'lodash'
import type { ICameraVideoTrack, IMicrophoneAudioTrack } from 'ts-rtc-sdk-web'
import { getTrack } from '../store/mediaTrackStore'
import store from '../store'

const setCamera = (deviceId:string):Promise<void> => {
  const track = getTrack<ICameraVideoTrack>('')
  const hasNoVideoTrack = _.isNil(track)

  if (hasNoVideoTrack === false) {
    if (store.settingsStore.cameraId === deviceId) {
      return Promise.resolve()
    }
  }

  return new Promise(async (resolve, reject) => {
    try {
      // 正常切换设备
      store.localVideos.get('')?.setFirstFrameDecoded(false)
      await track.setEnabled(true)
      await track.setDevice(deviceId)
      store.settingsStore.update({ cameraId: deviceId })
    } catch (error) {
      reject(error)
    }
    resolve()
  })
}

const setMic = (deviceId: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const track = getTrack<IMicrophoneAudioTrack>('localAudio', false)
    const hasNoAudioTrack = _.isNil(track)

    if (hasNoAudioTrack === false) {
      if (store.settingsStore.micId === deviceId) {
        return Promise.resolve()
      }
    }

    try {
      await track.setEnabled(true)
      await track.setDevice(deviceId)
    } catch (error) {
      reject(error)
    }

    store.settingsStore.update({ micId: deviceId })
    resolve()
  })
}

export {
  setCamera,
  setMic,
}
