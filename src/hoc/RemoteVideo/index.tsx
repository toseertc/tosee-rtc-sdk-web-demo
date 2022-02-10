import _ from 'lodash'
import React, {
  useEffect, useCallback, useRef, useState,
} from 'react'
import {
  SetRemoteVideoStreamTypeErrorCode, VideoFitMode, DualStreamType, IRemoteVideoTrack,
} from 'ts-rtc-sdk-web'

import RemoteVideo from '../../component/RemoteVideo'
import {
  RemoteVideoInfo,
  RemoteAudioInfo,
} from '../../types'
import store from '../../store'
import {
  getTrack,
} from '../../store/mediaTrackStore'
import { getClient } from '../../ts-rtc-sdk'
import {
  subscribeVideo,
  unsubscribeVideo,
  subscribeAudio,
  unsubscribeAudio,
} from '../../sdkUtils/subscribeManage'
import { addTempTip } from '../../utils/mediaTipUpdater'

export interface VideoPlayerConfig {
  mirror?: boolean,
  fit?: VideoFitMode,
}

export interface RemoteVideoHOCProps {
  videoInfo: RemoteVideoInfo,
  audioInfo: RemoteAudioInfo,
  videoPlayerConfig: VideoPlayerConfig,
}

export default function RemoteVideoHOC({
  videoInfo, audioInfo, videoPlayerConfig,
}: RemoteVideoHOCProps) {
  const [swichingVideo, setSwitchingVideo] = useState(false)
  const [swichingAudio, setSwitchingAudio] = useState(false)

  const videoContainerRef = useRef(null)

  useEffect(() => {
    const track = getTrack<IRemoteVideoTrack>(videoInfo.id, true)
    if (videoInfo.subscribing === true && videoInfo.muted === false) {
      track?.play(videoContainerRef.current, videoPlayerConfig)
    }
    return () => {
      if (videoInfo.subscribing === true && videoInfo.muted === false) {
        track?.pause()
      }
    }
  }, [videoInfo.subscribing, videoInfo.muted, videoInfo.id, videoPlayerConfig])

  const handleSwitchAudio = useCallback(
    () => {
      if (swichingAudio || _.isNil(audioInfo)) {
        console.log('ignored for swichingAudio')
        return
      }
      setSwitchingAudio(true)
      if (audioInfo.subscribing) {
        unsubscribeAudio(audioInfo).catch((e) => {
          console.warn('audio unsubscribe err', audioInfo.id, e)
        }).finally(() => {
          setSwitchingAudio(false)
        })
      } else {
        subscribeAudio(audioInfo).then((track) => {
          track.play()
        }).catch((e) => {
          console.warn('audio subscribe err', audioInfo.id, e)
        }).finally(() => {
          setSwitchingAudio(false)
        })
      }
    },
    [audioInfo, swichingAudio],
  )

  const handleSwitchVideo = useCallback(
    () => {
      if (swichingVideo) {
        console.log('ignored for swichingVideo')
        return
      }
      setSwitchingVideo(true)
      if (videoInfo.subscribing) {
        unsubscribeVideo(videoInfo).catch((e) => {
          console.warn('video unsubscribe err', videoInfo.id, e)
        }).finally(() => {
          setSwitchingVideo(false)
        })
      } else {
        subscribeVideo(videoInfo).then((track) => {
          track.play(videoContainerRef.current, videoPlayerConfig)
        }).catch((e) => {
          console.warn('video subscribe err', videoInfo.id, e)
        }).finally(() => {
          setSwitchingVideo(false)
        })
      }
    },
    [swichingVideo, videoInfo, videoPlayerConfig],
  )

  const handleSwitchHDErr = useCallback(
    (e) => {
      let tip
      // 本条件下不会切换视频没有FirstFrameDecoded事件
      store.remoteVideos.get(videoInfo.id).setFirstFrameDecoded(true)
      switch (e.code) {
        case SetRemoteVideoStreamTypeErrorCode.InvalidStreamName:
          tip = '切换大小流失败: 名字无效'
          break
        case SetRemoteVideoStreamTypeErrorCode.InvalidStreamType:
          tip = '切换大小流失败: 类型无效'
          break
        case SetRemoteVideoStreamTypeErrorCode.InvalidUserId:
          tip = '切换大小流失败: 用户ID无效'
          break
        case SetRemoteVideoStreamTypeErrorCode.NotDualStream:
          tip = '远端未开启大小流无法切换'
          break
        case SetRemoteVideoStreamTypeErrorCode.StreamNotPublished:
          tip = '切换失败，对方未推流'
          break
        default:
          tip = '切换大小流失败'
      }
      addTempTip(tip)
      console.warn('client.setRemoteVideoStreamType err', e, tip)
    },
    [videoInfo.id],
  )

  const handleSwitchHD = useCallback(
    () => {
      const client = getClient()
      const remoteVideo = store.remoteVideos.get(videoInfo.id)
      const isHDSettingInClient = client.getRemoteVideoStreamType(videoInfo.user.uid, videoInfo.streamName) === DualStreamType.High
      if (videoInfo.isHDSetting !== isHDSettingInClient) {
        remoteVideo.setIsHDSetting(isHDSettingInClient)
      } else {
        remoteVideo.setFirstFrameDecoded(false)
        if (videoInfo.isHD !== videoInfo.isHDSetting) {
          // 本条件下不会切换视频没有FirstFrameDecoded事件
          remoteVideo.setFirstFrameDecoded(true)
        }
        if (videoInfo.isHDSetting) {
          client.setRemoteVideoStreamType(videoInfo.user.uid, DualStreamType.Low, videoInfo.streamName).then(() => {
            remoteVideo.setIsHDSetting(!videoInfo.isHDSetting)
            addTempTip('切换到小流')
          }).catch(handleSwitchHDErr)
        } else {
          client.setRemoteVideoStreamType(videoInfo.user.uid, DualStreamType.High, videoInfo.streamName).then(() => {
            remoteVideo.setIsHDSetting(!videoInfo.isHDSetting)
            addTempTip('切换到大流')
          }).catch(handleSwitchHDErr)
        }
      }
    },
    [handleSwitchHDErr, videoInfo.id, videoInfo.isHD, videoInfo.isHDSetting, videoInfo.streamName, videoInfo.user.uid],
  )

  return (
    <RemoteVideo
      userId={videoInfo.user.uid}
      isHDSetting={videoInfo.isHDSetting}
      isAudioStreamMuted={audioInfo?.muted}
      isAudioSubscribing={audioInfo?.subscribing}
      isVideoStreamMuted={videoInfo.muted}
      isVideoSubscribing={videoInfo.subscribing}
      onSwitchAudio={handleSwitchAudio}
      onSwitchHD={handleSwitchHD}
      onSwitchVideo={handleSwitchVideo}
      ref={videoContainerRef}
      isSwichingVideo={swichingVideo}
      isSwichingAudio={swichingAudio}
      isFirstFrameDecoded={videoInfo.firstFrameDecoded}
    />
  )
}
