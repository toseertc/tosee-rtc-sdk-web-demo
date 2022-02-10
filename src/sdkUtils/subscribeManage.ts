import _ from 'lodash'
import {
  MediaType,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
} from 'ts-rtc-sdk-web'

import { RemoteVideoInfo, RemoteAudioInfo } from '../types'
import store from '../store'
import {
  setTrack, removeTrack,
} from '../store/mediaTrackStore'
import { getClient } from '../ts-rtc-sdk'

function subscribeVideo(videoInfo: Pick<RemoteVideoInfo, 'streamName' | 'user' | 'id'>): Promise<IRemoteVideoTrack> {
  return getClient().subscribe(videoInfo.user.uid, MediaType.Video, videoInfo.streamName).then((track: IRemoteVideoTrack) => {
    const remoteVideo = store.remoteVideos.get(videoInfo.id)
    setTrack(videoInfo.id, track, true)
    remoteVideo.setSubscribing(true)
    remoteVideo.setFirstFrameDecoded(false)
    return track
  })
}

function unsubscribeVideo(videoInfo: Pick<RemoteVideoInfo, 'streamName' | 'user' | 'id'>): Promise<void> {
  return getClient().unsubscribe(videoInfo.user.uid, MediaType.Video, videoInfo.streamName).then(() => {
    removeTrack(videoInfo.id, true)
    store.remoteVideos.get(videoInfo.id).setSubscribing(false)
  })
}

function subscribeAudio(audioInfo: Pick<RemoteAudioInfo, 'id' | 'user'>): Promise<IRemoteAudioTrack> {
  return getClient().subscribe(audioInfo.user.uid, MediaType.Audio).then((track: IRemoteAudioTrack) => {
    setTrack(audioInfo.id, track, false)
    store.remoteAudios.get(audioInfo.id).setSubscribing(true)
    return track
  })
}
function unsubscribeAudio(audioInfo: Pick<RemoteAudioInfo, 'id' | 'user'>): Promise<void> {
  return getClient().unsubscribe(audioInfo.user.uid, MediaType.Audio).then(() => {
    removeTrack(audioInfo.id, false)
    const remoteAudio = store.remoteAudios.get(audioInfo.id)
    remoteAudio.setSubscribing(false)
    remoteAudio.setVolume(NaN)
  })
}

function subAllVideos(): Promise<IRemoteVideoTrack[]> {
  return Promise.all<IRemoteVideoTrack>(_.values(store.remoteVideos.toJSON()).map((videoInfo: Pick<RemoteVideoInfo, 'streamName' | 'user' | 'id'>) => {
    return subscribeVideo(videoInfo)
  }))
}

function unsubAllVideos(): Promise<void[]> {
  return Promise.all<void>(_.values(store.remoteVideos.toJSON()).map((videoInfo: Pick<RemoteVideoInfo, 'id' | 'streamName' | 'user'>) => {
    return unsubscribeVideo(videoInfo)
  }))
}

function subAllAudios(): Promise<IRemoteAudioTrack[]> {
  return Promise.all<IRemoteAudioTrack>(_.values(store.remoteAudios.toJSON()).map((audioInfo: Pick<RemoteAudioInfo, 'id' | 'user'>) => {
    return subscribeAudio(audioInfo)
  }))
}

function unsubAllAudios(): Promise<void[]> {
  return Promise.all<void>(_.values(store.remoteAudios.toJSON()).map((audioInfo: Pick<RemoteAudioInfo, 'id' | 'user'>) => {
    return unsubscribeAudio(audioInfo)
  }))
}

export {
  subscribeVideo,
  unsubscribeVideo,
  subscribeAudio,
  unsubscribeAudio,
  subAllVideos,
  unsubAllVideos,
  subAllAudios,
  unsubAllAudios,
}
