import React from 'react'
import CX from 'classnames'
import _ from 'lodash'
import './index.less'

interface ChannelLayoutProps {
  style?: Object,
  videosContainer: React.ReactNode,
  channelHeader: React.ReactNode,
  rightSideBox: React.ReactNode,
  showSideBox?:boolean,
  onCloseRightSideBox?: () => void,
}
export default function ChannelLayout({
  style, channelHeader, videosContainer, rightSideBox, showSideBox, onCloseRightSideBox,
}: ChannelLayoutProps) {
  const rightSideBoxWrapperRef = React.useRef(null)
  const rightSideBoxContentRef = React.useRef(null)
  React.useEffect(() => {
    const wrapperRef = rightSideBoxWrapperRef.current
    const onClick = (e) => {
      if (!rightSideBoxContentRef.current?.contains(e.target)) {
        onCloseRightSideBox()
      }
    }
    wrapperRef?.addEventListener('click', onClick)
    return () => {
      wrapperRef?.removeEventListener('click', onClick)
    }
  }, [])

  const wrapperStyle = _.assign({}, style)
  return (
    <div className="ts-web-test-app-channel-layout-wrapper" style={wrapperStyle}>
      <div className="channel-header-wrap">
        {channelHeader}
      </div>
      <div className="videos-container-wrap">
        {videosContainer}
      </div>
      <div className={CX({ 'right-side-box-wrap': true, hidden: showSideBox === false })} ref={rightSideBoxWrapperRef}>
        <div className="right-side-box-content" ref={rightSideBoxContentRef}>
          {rightSideBox}
        </div>
      </div>
    </div>
  );
}

ChannelLayout.defaultProps = {
  style: {},
  showSideBox: false,
  onCloseRightSideBox: _.noop,
}
