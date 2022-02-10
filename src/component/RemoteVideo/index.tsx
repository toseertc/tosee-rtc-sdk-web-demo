import React from 'react'
import classNames from 'classnames'

import './index.less'

export interface RemoteVideoProps {
  style?: Object,
  userId: string,
  isVideoStreamMuted: boolean,
  isVideoSubscribing: boolean,
  isAudioStreamMuted: boolean,
  isAudioSubscribing: boolean,
  isHDSetting: boolean,
  onSwitchVideo: () => void,
  onSwitchAudio: () => void,
  onSwitchHD: () => void,
  isSwichingAudio: boolean,
  isSwichingVideo: boolean,
  isFirstFrameDecoded: boolean,
}

function RemoteVideo(props: RemoteVideoProps, ref) {
  const {
    style,
    userId,
    isVideoStreamMuted,
    isVideoSubscribing,
    isAudioStreamMuted,
    isAudioSubscribing,
    isHDSetting,
    onSwitchVideo,
    onSwitchAudio,
    onSwitchHD,
    isSwichingAudio,
    isSwichingVideo,
    isFirstFrameDecoded,
  } = props

  const wrapperRef = React.useRef(null)

  return (
    <div
      className="ts-web-test-app-remote-video-wrapper"
      style={style}
      ref={wrapperRef}
    >
      <div className="header">
        <div className="user-id" title={userId}>{`${userId}`}</div>
      </div>
      <div
        className="main-content"
      >
        {
          (isVideoStreamMuted === true || isVideoSubscribing === false) && (
            <div
              className="video-status-info-wrap"
            >
              {
                isVideoStreamMuted === true && (
                  <div className="video-status-info-item">
                    <i className="video-status-icon" />
                    远端视频流停止发送
                  </div>
                )
              }
              {
                isVideoSubscribing === false && (
                  <div className="video-status-info-item">
                    <i className="video-status-icon" />
                    已停止拉取远端视频流
                  </div>
                )
              }
            </div>
          )
        }
        {
          ((isFirstFrameDecoded === false && isVideoSubscribing === true && isVideoStreamMuted === false) || (isVideoSubscribing === null)) && (
            <div
              className="video-status-info-wrap"
            >
              <i className="loading-icon" />
              加载中...
            </div>
          )
        }
        <div
          // @ts-ignore
          ref={ref}
          className="video-elememt-container"
        />
      </div>

      <div className="foot">
        <div
          className={classNames({
            'stream-button': true,
            'not-allowed': isSwichingVideo === true,
          })}
          onClick={onSwitchVideo}
        >
          <i
            className={classNames({
              'video-normal-icon': !isVideoStreamMuted,
              'video-err-icon': isVideoStreamMuted,
            })}
          />
          {isVideoSubscribing ? '开启' : '停止'}
        </div>
        <div
          className={classNames({
            'stream-button': true,
            'not-allowed': isSwichingAudio === true,
          })}
          onClick={onSwitchAudio}
        >
          <i
            className={classNames({
              'audio-normal-icon': !isAudioStreamMuted,
              'audio-err-icon': isAudioStreamMuted,
            })}
          />
          {isAudioSubscribing ? '开启' : '停止'}
        </div>
        <div
          className={classNames({
            'hd-button': true,

          })}
          onClick={onSwitchHD}
        >
          <i
            className={classNames({
              'is-hd': isHDSetting,
              'not-hd': !isHDSetting,
            })}
          />
          {isHDSetting ? '高清' : '流畅'}
        </div>
      </div>
    </div>
  )
}

export default React.forwardRef(RemoteVideo)
