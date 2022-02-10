import React from 'react'
import _ from 'lodash'
import { ClientMode, ClientRole } from 'ts-rtc-sdk-web'

import VideosContainer from '../../component/VideosContainer'
import LocalVideo from '../LocalVideo'
import RemoteVideo from '../RemoteVideo'
import store from '../../store'
import useStore from '../../hooks/useStore';
import VideoContainer from '../../component/VideoContainer'

export default function VideosContainerHoc() {
  const remoteMediasSortedByUid = useStore(store, 'remoteMediasSortedByUid')
  const localAudio = useStore(store, 'localAudio')
  const localVideos = useStore(store, 'localVideos')
  const videoPlayerConfig = useStore(store.settingsStore, 'defaultVideoPlayerConfig')
  const mediaTip = useStore(store, 'mediaTip')

  const RemoteVideos = []
  remoteMediasSortedByUid.forEach((media) => {
    media.videos.forEach((video) => {
      RemoteVideos.push((
        <VideoContainer
          videoId={video.id}
          key={video.id}
        >
          <RemoteVideo
            videoInfo={video}
            audioInfo={media.audio}
            videoPlayerConfig={videoPlayerConfig}
          />
        </VideoContainer>
      ))
    })
  })

  const LocalVideos = _.map(localVideos, (video) => {
    return (
      <VideoContainer
        videoId={video.id}
        key={video.id}
      >
        <LocalVideo
          videoInfo={video}
          audioInfo={localAudio}
          videoPlayerConfig={videoPlayerConfig}
        />
      </VideoContainer>
    )
  })

  return (
    <VideosContainer
      videoItems={[
        ...LocalVideos,
        ...RemoteVideos,
      ]}
      tip={mediaTip}
      clientMode={ClientMode.Communicate}
      clientRole={ClientRole.Broadcaster}
    />
  )
}
