import React, {
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { ICameraVideoTrack, VideoFitMode } from 'ts-rtc-sdk-web'

import LocalVideo from '../../component/LocalVideo'
import useStore from '../../hooks/useStore'
import store from '../../store'
import { getTrack } from '../../store/mediaTrackStore'
import { DeviceID } from '../../const'

export interface VideoInfo {
  id: string,
  muted: boolean,
  firstFrameDecoded: boolean,
  createTrackError: string,
}
export interface AudioInfo {
  id: string,
  volume: number,
  muted: boolean,
}

export interface VideoPlayerConfig {
  mirror?: boolean,
  fit?: VideoFitMode,
}
export interface LocalVideoHOCProps {
  videoInfo: VideoInfo,
  audioInfo: AudioInfo,
  videoPlayerConfig: VideoPlayerConfig,
}

export default function LocalVideoHOC({
  videoInfo, audioInfo, videoPlayerConfig,
}: LocalVideoHOCProps) {
  const selfUid = useStore(store, 'selfUid')
  const cameraId = useStore(store.settingsStore, 'cameraId')

  const videoContainerRef = useRef(null)

  useEffect(() => {
    const track = getTrack<ICameraVideoTrack>(videoInfo.id, true)
    track?.play(videoContainerRef.current, videoPlayerConfig)
    return () => {
      track?.pause()
    }
  }, [videoInfo.id, videoInfo.muted, videoPlayerConfig])

  return (
    <LocalVideo
      userId={selfUid}
      isVideoStreamAvailable={cameraId !== DeviceID.close && cameraId !== DeviceID.empty}
      isCameraEmpty={cameraId === DeviceID.empty}
      createTrackError={videoInfo.createTrackError}
      ref={videoContainerRef}
      isFirstFrameDecoded={videoInfo.firstFrameDecoded}
    />
  )
}
