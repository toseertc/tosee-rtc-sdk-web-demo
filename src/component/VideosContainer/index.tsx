import React from 'react'

import './index.less'
import { ClientMode, ClientRole } from 'ts-rtc-sdk-web'

interface VideosContainerProps {
  style?: Object,
  videoItems?: React.ReactNode[],
  tip?: string,
  clientMode: ClientMode,
  clientRole: ClientRole
}
function VideosContainer({
  style, videoItems, tip, clientMode, clientRole,
}: VideosContainerProps) {
  const renderEmptyInfo = () => {
    if (clientMode === ClientMode.Broadcast) {
      if (clientRole === ClientRole.Audience) {
        return '请等待频道内主播到来'
      }
      return '请打开摄像头'
    }
    return '请打开摄像头'
  }

  return (
    <div className="ts-web-test-app-videos-container-wrap" style={style}>
      <div className="main-content-wrap">
        <div className="main-content">
          {
            videoItems.length < 1 && (
              <div className="empty-info">{renderEmptyInfo()}</div>
            )
          }
          {
            videoItems
          }
          {
            tip !== '' && (
            <span className="temp-tip">{tip}</span>
            )
          }
        </div>
      </div>
    </div>
  )
}

VideosContainer.defaultProps = {
  style: {},
  videoItems: [],
  tip: '',
}

export default VideosContainer
