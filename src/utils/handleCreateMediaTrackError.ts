import BaseError from './BaseError'
import { CREATE_VIDEO_TRACK_ERR_MSG, CREATE_AUDIO_TRACK_ERR_MSG } from '../const'
import { addTempTip } from './mediaTipUpdater'

const handleCreateVideoTrackError = (e: BaseError) => {
  const tip = CREATE_VIDEO_TRACK_ERR_MSG[e.code] || '摄像头打开失败'
  addTempTip(tip)
  return tip
}

const handleCreateAudioTrackError = (e: BaseError) => {
  const tip = CREATE_AUDIO_TRACK_ERR_MSG[e.code] || '麦克风打开失败'
  addTempTip(tip)
  return tip
}

export {
  handleCreateVideoTrackError,
  handleCreateAudioTrackError,
}
