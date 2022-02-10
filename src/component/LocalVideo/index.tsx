import React from 'react'

import './index.less'

export interface LocalVideoProps {
  style?: Object,
  userId: string,
  isVideoStreamAvailable: boolean, // 摄像头关闭为 false 否则为 true
  isCameraEmpty: boolean,
  createTrackError: string,
  isFirstFrameDecoded: boolean,
}
export default React.forwardRef((props: LocalVideoProps, ref) => {
  const {
    style,
    userId,
    isVideoStreamAvailable,
    createTrackError,
    isCameraEmpty,
    isFirstFrameDecoded,
  } = props

  const wrapperRef = React.useRef(null)

  return (
    <div
      className="ts-web-test-app-local-video-wrapper"
      style={style || {}}
      ref={wrapperRef}
    >
      <div className="header">
        <div className="user-id">
          {`${userId}`}
          （我）
        </div>
      </div>
      <div
        className="main-content"
      >
        {
          isVideoStreamAvailable === false && (
            <div className="video-status-info-wrap">
              <i className="no-remote-stream-icon" />
              本地摄像头已关闭
            </div>
          )
        }
        {
          isCameraEmpty === true && (
            <div className="video-status-info-wrap">
              <i className="no-remote-stream-icon" />
              未检测到可用的摄像头
            </div>
          )
        }
        {
          createTrackError !== '' && (
            <div className="video-status-info-wrap">
              <i className="no-remote-stream-icon" />
              {createTrackError}
            </div>
          )
        }
        {
          isFirstFrameDecoded === false && isVideoStreamAvailable === true && createTrackError === '' && (
            <div className="video-status-info-wrap">
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
    </div>
  )
})
