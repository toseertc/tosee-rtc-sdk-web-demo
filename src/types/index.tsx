import { RemoteUser } from 'ts-rtc-sdk-web'

export interface RemoteVideoInfo {
  id: string,
  streamName: string,
  subscribing: boolean,
  muted: boolean,
  isHD: boolean,
  isHDSetting: boolean,
  user: RemoteUser,
  firstFrameDecoded: boolean,
}
export interface RemoteAudioInfo {
  id: string,
  volume: number,
  subscribing: boolean,
  muted: boolean,
  user: RemoteUser,
}
