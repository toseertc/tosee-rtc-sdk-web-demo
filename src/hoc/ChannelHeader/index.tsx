import React from 'react'
import ChannelHeader from '../../component/ChannelHeader'
import useStore from '../../hooks/useStore'
import store from '../../store'

interface ChannelHeaderHocProps {
  onClickMore: () => void
}

export default function ChannelHeaderHoc(props: ChannelHeaderHocProps) {
  const { onClickMore } = props
  const channelId = useStore(store, 'channelId')

  const handleClickMore = () => {
    onClickMore()
  }

  return (
    <ChannelHeader
      channelId={channelId}
      onClickMore={handleClickMore}
    />
  )
}
