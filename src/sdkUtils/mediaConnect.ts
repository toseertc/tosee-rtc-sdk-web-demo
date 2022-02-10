import _ from 'lodash'

import {
  MediaType, IRemoteAudioTrack,
  DualStreamType,
  ConnectionState,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'ts-rtc-sdk-web'
import { TsRTC, getClient } from '../ts-rtc-sdk'

import store from '../store'
import {
  setTrack, getTrack, videoTrackStore, audioTrackStore, removeTrack, removeAllTracks,
} from '../store/mediaTrackStore'
import { DeviceID } from '../const'
import { unsubscribeAudio, unsubscribeVideo } from './subscribeManage'
import { addTempTip, setTip } from '../utils/mediaTipUpdater'
import { handleCreateAudioTrackError, handleCreateVideoTrackError } from '../utils/handleCreateMediaTrackError'

const addListeners = () => {
  const client = getClient()
  if (!client) {
    console.warn('getClient err', client)
    return
  }
  client.onUserJoined((remoteUser) => {
    console.log('client onUserJoined', remoteUser)
    store.addRemoteUser(remoteUser)
  })

  client.onUserLeft((remoteUser) => {
    console.log('client onUserLeft', remoteUser)
    store.removeRemoteUser(remoteUser)
  })

  client.onUserPublished((user, mediaType, { streamName, isDual, muted }) => {
    console.log('client onUserPublished', user, mediaType, streamName)
    if (mediaType === MediaType.Audio) {
      const id = store.addRemoteAudio(user)
      const remoteAudio = store.remoteAudios.get(id)
      remoteAudio.setMuted(muted)
      client.subscribe(user.uid, MediaType.Audio).then((track: IRemoteAudioTrack) => {
        setTrack(id, track, false)
        track.play()
        remoteAudio.setSubscribing(true)
        console.log('remote audio setSubscribing true', id)
      }).catch((e) => {
        console.warn('audio subscribe err in mediaConnect', id, e)
      })
    }
    if (mediaType === MediaType.Video) {
      const id = store.addRemoteVideo(user, streamName)
      const remoteVideo = store.remoteVideos.get(id)
      const streamType = client.getRemoteVideoStreamType(user.uid, streamName)
      remoteVideo.setIsHDSetting(streamType === DualStreamType.High)
      remoteVideo.setMuted(muted)

      client.subscribe(user.uid, MediaType.Video, streamName).then((track) => {
        setTrack(id, track, true)
        remoteVideo.setSubscribing(true)
        remoteVideo.setFirstFrameDecoded(false)
      }).catch((e) => {
        console.warn('video subscribe err in mediaConnect', id, e)
      })
    }
  })
  client.onUserUnpublished((user, mediaType, { streamName, isDual, muted }) => {
    console.log('client onUserUnpublished', user, mediaType, streamName)
    if (mediaType === MediaType.Audio) {
      unsubscribeAudio(store.remoteAudios.get(user.uid)).then(() => {
        store.removeRemoteAudio(user)
      }).catch((e) => {
        console.warn('err in onUserUnpublished unsubscribeAudio', e)
      })
    }
    if (mediaType === MediaType.Video) {
      const id = user.uid + streamName
      unsubscribeVideo(store.remoteVideos.get(id)).then(() => {
        store.removeRemoteVideo(user, streamName)
      }).catch((e) => {
        console.warn('err in onUserUnpublished unsubscribeVideo', e)
      })
    }
  })
  client.onUserMuted((remoteUser, mediaType, streamName) => {
    console.log('client onUserMuted', remoteUser, mediaType, streamName)
    if (mediaType === MediaType.Audio) {
      store.remoteAudios.get(remoteUser.uid)?.setMuted(true)
      store.remoteAudios.get(remoteUser.uid)?.setVolume(NaN)
    }
    if (mediaType === MediaType.Video) {
      store.remoteVideos.get(remoteUser.uid + streamName)?.setMuted(true)
    }
  })

  client.onUserUnmuted((remoteUser, mediaType, streamName) => {
    console.log('client onUserUnmuted', remoteUser, mediaType, streamName)
    if (mediaType === MediaType.Audio) {
      store.remoteAudios.get(remoteUser.uid)?.setMuted(false)
    }
    if (mediaType === MediaType.Video) {
      store.remoteVideos.get(remoteUser.uid + streamName)?.setMuted(false)
    }
  })

  client.onUserStreamTypeChanged((remoteUser, currentStreamType, lastStreamType, streamName) => {
    console.log('client onUserStreamTypeChanged', remoteUser, currentStreamType, lastStreamType, streamName)
    const id = remoteUser.uid + streamName
    if (currentStreamType === DualStreamType.High) {
      store.remoteVideos.get(id)?.setIsHD(true)
    }
    if (currentStreamType === DualStreamType.Low) {
      store.remoteVideos.get(id)?.setIsHD(false)
    }
  })

  client.onConnectionStateChanged((currentState, lastState, reason) => {
    console.log('client onConnectionStateChanged', currentState, lastState, reason)
    switch (currentState) {
      case ConnectionState.ConnectFailed:
        store.promptStore.setConnectFailed(true)
        break
      case ConnectionState.Reconnecting:
        setTip('正在连接...')
        break
      case ConnectionState.Reconnected:
        addTempTip('已连接')
        break
      default:
    }
  })
  client.onKickOut(() => {
    console.log('client onKickOut')
    store.promptStore.setKickOut(true)
  })
}

const createLocalTracks = (isCreateVideoTrack: boolean = true, isCreateAudioTrack: boolean = true): Promise<void> => {
  const client = getClient()
  return new Promise(async (resolve, reject) => {
    if (isCreateVideoTrack === true) {
      // 对接视频1设置
      store.addLocalVideo('')
      if (store.settingsStore.cameraId !== DeviceID.close) {
        try {
          const track = await TsRTC.createCameraVideoTrack(store.cameraVideoTrackInitConfig1)
          track.onFirstFrameDecoded((width, height) => {
            store.localVideos.get('').setFirstFrameDecoded(true)
          })
          await client.publish(track, '')
          setTrack('', track, true)
          await track.setEnableDualStream(true)
          store.localVideos.get('').setMuted(false)
        } catch (e) {
          handleCreateVideoTrackError(e)
          reject(e)
        }
      }
    }

    if (isCreateAudioTrack === true && (store.settingsStore.micId !== DeviceID.close)) {
      try {
        const track = await TsRTC.createMicrophoneAudioTrack({ microphoneId: store.settingsStore.micId })
        await client.publish(track)
        setTrack('localAudio', track, false)
        store.localAudio.setMuted(false)
      } catch (e) {
        handleCreateAudioTrackError(e)
        reject(e)
      }
    }
    resolve()
  })
}

const destroyLocalTracks = () => {
  const client = getClient()
  const unpublishRes = []
  _.forEach([''], (id) => {
    const track = getTrack<ICameraVideoTrack>(id, true)
    if (track) {
      unpublishRes.push(client.unpublish(track))
      track.destroy()
      removeTrack(id, true)
    }
  })
  const localAudioTrack = getTrack<IMicrophoneAudioTrack>('localAudio', false)
  if (localAudioTrack) {
    unpublishRes.push(client.unpublish(localAudioTrack))
    localAudioTrack.destroy()
    removeTrack('localAudio', false)
  }
  store.clearLocalVideos()
  return Promise.all(unpublishRes).catch((e) => { console.log(e.message) })
}

const initTracksRetryTimesSetting = 2 // initTracks 中获取设备信息失败后重试次数
let initTracksRetryTimes = 0
const initTracks = () => {
  const getDeviceRes = []
  if (store.settingsStore.cameraId === DeviceID.empty) {
    getDeviceRes.push(TsRTC.getCameras(true).then((devices) => {
      if (devices.length !== 0) {
        store.settingsStore.update({ cameraId: devices[0].deviceId })
      }
    }))
  }

  if (store.settingsStore.micId === DeviceID.empty) {
    getDeviceRes.push(TsRTC.getMicrophones(true).then((devices) => {
      if (devices.length !== 0) {
        store.settingsStore.update({ micId: devices[0].deviceId })
      }
    }))
  }

  Promise.all(getDeviceRes).then(() => {
    store.initLocalVideos()
    createLocalTracks()
  }).catch((e) => {
    console.warn('initTracks  getDevice Err', initTracksRetryTimes, e)
    initTracksRetryTimes += 1
    if (initTracksRetryTimes <= initTracksRetryTimesSetting) {
      initTracks()
    } else {
      // to fix no LocalVideo Comp when getDevice failed
      createLocalTracks()
    }
  })
}

const initConfigs = () => {
  // test code
  // @ts-ignore
  window.store = store
  // @ts-ignore
  window.mediaTrackStore = [audioTrackStore, videoTrackStore]
  initTracks()
}

const disconnect = () => {
  const client = getClient()
  destroyLocalTracks()
  removeAllTracks()

  client.leave().then(() => {
    console.log('client leave success')
  }).catch((e) => {
    console.warn('client leave err', e)
  }).finally(() => {
    store.setJoinnedChannel(false)
    initTracksRetryTimes = 0
  })
}

export {
  addListeners,
  initConfigs,
  disconnect,
  createLocalTracks,
  destroyLocalTracks,
}
