/* eslint-disable no-param-reassign */
import { types, getSnapshot, applySnapshot } from 'mobx-state-tree'
import _ from 'lodash'
import BaseType from './BaseType'
import LocalAudio from './LocalAudio'
import LocalVideo from './LocalVideo'
import PromptStore from './PromptStore'
import RemoteAudio from './RemoteAudio'
import RemoteVideo from './RemoteVideo'
import RemoteUser from './RemoteUser'
import SettingsStore from './SettingsStore'

const store = BaseType.props({
  channelId: types.string,
  joinedChannel: types.boolean,
  remoteUsers: types.map(RemoteUser),
  promptStore: PromptStore,
  selfUid: types.string,
  localAudio: LocalAudio,
  localVideos: types.map(LocalVideo),
  remoteVideos: types.map(RemoteVideo),
  remoteAudios: types.map(RemoteAudio),
  mediaTip: '', // 视频区显示的小提示
  settingsStore: SettingsStore,
  networkQuality: types.map(types.number),
}).views((self) => ({
  get remoteMediasSortedByUid() {
    const result = new Map()
    _.map(self.remoteVideos.toJSON(), (video) => {
      const { uid } = video.user
      if (result.has(uid)) {
        result.get(uid).videos.push(video)
      } else {
        result.set(uid, {
          videos: [video],
          audio: {
            id: uid,
            volume: NaN,
            subscribing: false,
            muted: true,
            user: video.user,
          },
        })
      }
    })
    // 处理用户进入频道没有推视频流的情况
    _.map(self.remoteUsers.toJSON(), (user) => {
      const { uid } = user
      if (result.has(uid) === false) {
        result.set(uid, {
          videos: [{
            id: uid,
            streamName: '',
            user,
            subscribing: false,
            isHD: true,
            isHDSetting: true,
            muted: true, // 没有开始推流
          }],
          audio: {
            id: uid,
            volume: NaN,
            subscribing: false,
            muted: true,
            user,
          },
        })
      }
    })

    _.map(self.remoteAudios.toJSON(), (audio) => {
      result.get(audio.user.uid).audio = audio
    })
    return result
  },
  get cameraVideoTrackInitConfig1() {
    return {
      encoderConfig: self.settingsStore.videoInitConfig1.encoderConfig,
      optimizationMode: self.settingsStore.videoInitConfig1.optimizationMode,
      cameraId: self.settingsStore.cameraId,
    }
  },
  get showPrompt() {
    return self.promptStore.showPrompt
  },
}))
  .actions((self) => {
    let initState: any = {}
    return {
      setJoinnedChannel(joined: boolean) {
        self.joinedChannel = joined
      },
      addRemoteUser(user) {
        self.remoteUsers.set(user.uid, user)
      },
      removeRemoteUser(user) {
        self.remoteUsers.delete(user.uid)
      },
      setSelfUid(uid: string) {
        self.selfUid = uid
      },
      setMediaTip(tip: string) {
        self.mediaTip = tip
      },
      addLocalVideo(id: string) {
        self.localVideos.set(id, {
          id,
          muted: null,
        })
        return id
      },
      clearLocalVideos() {
        self.localVideos.clear()
      },
      initLocalVideos() {
        self.localVideos.clear()
        self.localVideos.set('', {
          id: '',
          muted: null,
        })
      },
      addRemoteVideo(user, streamName) {
        const id = user.uid + streamName
        if (self.remoteVideos.has(id)) {
          self.remoteVideos.get(id).user = user
        } else {
          self.remoteVideos.set(id, {
            id,
            streamName,
            user,
            subscribing: null,
            isHD: true,
            isHDSetting: true,
            muted: false,
          })
        }
        return id
      },
      removeRemoteVideo(user, streamName) {
        const id = user.uid + streamName
        self.remoteVideos.delete(id)
        return id
      },
      addRemoteAudio(user) {
        const id = user.uid
        if (self.remoteAudios.has(id)) {
          self.remoteAudios.get(id).user = user
        } else {
          self.remoteAudios.set(id, {
            id,
            volume: NaN,
            subscribing: false,
            muted: false,
            user,
          })
        }
        return id
      },
      removeRemoteAudio(user) {
        self.remoteAudios.delete(user.uid)
        return user.uid
      },
      afterCreate() {
        initState = getSnapshot(self)
      },
      reset() {
        const { channelId } = self
        const userId = self.selfUid
        applySnapshot(self, initState)
        self.channelId = channelId
        self.selfUid = userId
      },
      updateNetworkQuality(userId:string, networkQuality:{uplink:number, downlink:number}) {
        self.networkQuality.set(userId, networkQuality.uplink)
      },
    }
  })

export default store
