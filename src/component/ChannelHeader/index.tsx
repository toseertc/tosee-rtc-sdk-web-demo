import React from 'react'

import './index.less'

export interface ChannelHeaderProps {
  style?: Object,
  channelId: string,
  onClickMore: () => void,
}

export default function ChannelHeader(props: ChannelHeaderProps) {
  const {
    style,
    channelId,
    onClickMore,
  } = props

  return (
    <div
      className="ts-web-test-app-channel-header-wrapper"
      style={style}
    >
      <div className="left-part">
        <div className="channel-id">{`频道ID:${channelId}`}</div>
      </div>
      <div className="right-part">
        <div
          className="button-wrap"
          onClick={onClickMore}
        >
          <i className="more-icon" />
          更多
        </div>
      </div>
    </div>
  )
}

ChannelHeader.defaultProps = {
  style: {},
}
