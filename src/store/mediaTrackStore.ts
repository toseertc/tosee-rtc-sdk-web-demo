import type {
  ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteAudioTrack, IRemoteVideoTrack,
} from 'ts-rtc-sdk-web'
import store from './index'

/**
 * 保存 audioTrack 或 videoTrack
 * 推流1 id 为 ''
 * 本地音频 id 为 'localAudio'
 * 远端视频 id 为 remoteVideo.id
 * 远端音频 id 为 remoteAudio.id
 */
type UsedTrack = IRemoteAudioTrack | IRemoteVideoTrack | ICameraVideoTrack | IMicrophoneAudioTrack
type StreamId = string | '' | 'localAudio'

const videoTrackStore = new Map<StreamId, IRemoteVideoTrack | ICameraVideoTrack>()
const audioTrackStore = new Map<StreamId, IRemoteAudioTrack | IMicrophoneAudioTrack>()

const setTrack = (id: StreamId, track: UsedTrack, isVideo: boolean) => {
  if (isVideo) {
    videoTrackStore.set(id, track as IRemoteVideoTrack | ICameraVideoTrack);
    (track as IRemoteVideoTrack | ICameraVideoTrack).onFirstFrameDecoded((width: number, height: number) => {
      console.log('onFirstFrameDecoded', id)
      if (id === '') {
        store.localVideos.get(id).setFirstFrameDecoded(true)
      } else {
        store.remoteVideos.get(id).setFirstFrameDecoded(true)
      }
    })
  } else {
    audioTrackStore.set(id, track as IRemoteAudioTrack | IMicrophoneAudioTrack);
    (track as IRemoteAudioTrack | IMicrophoneAudioTrack).onAutoPlayFailed(() => {
      console.log('onAutoPlayFailed', id)
    })
  }
}

const removeTrack = (id: string, isVideo: boolean) => {
  if (isVideo) {
    videoTrackStore.delete(id)
  } else {
    audioTrackStore.delete(id)
  }
}

const removeAllTracks = () => {
  videoTrackStore.clear()
  audioTrackStore.clear()
}

const getTrack: <T extends UsedTrack>(id: StreamId, isVideo?: boolean) => T = (id, isVideo = true) => {
  let track
  if (isVideo) {
    track = videoTrackStore.get(id)
  } else {
    track = audioTrackStore.get(id)
  }
  return track
}

const getAllTracks = (isVideo: boolean = true) => {
  if (isVideo) {
    return Array.from(videoTrackStore.keys()).map((key) => {
      return videoTrackStore.get(key)
    })
  }
  return Array.from(audioTrackStore.keys()).map((key) => {
    return audioTrackStore.get(key)
  })
}

export {
  getTrack,
  setTrack,
  removeTrack,
  videoTrackStore,
  audioTrackStore,
  getAllTracks,
  removeAllTracks,
}
