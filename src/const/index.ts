import {
  GetDevicesErrorCode,
  CreateCameraVideoTrackErrorCode,
  CreateMicrophoneAudioTrackErrorCode,
  JoinErrorCode,
} from 'ts-rtc-sdk-web'

export const TS_RTC_TEST_APP_LOGS = 'TS_RTC_TEST_APP_LOGS'

export const DeviceID = {
  empty: '',
  close: 'close',
}

export const DEVICE_ERR_MSG = {
  [GetDevicesErrorCode.PermissionDenied]: '无设备权限',
  [GetDevicesErrorCode.NotSupportEnumerateDevices]: '浏览器不支持获取设备',
  [GetDevicesErrorCode.UnknownError]: '未知错误',
  [GetDevicesErrorCode.DeviceNotReadable]: '设备不可读',
}

export const CREATE_VIDEO_TRACK_ERR_MSG = {
  [CreateCameraVideoTrackErrorCode.InvalidCameraId]: '摄像头打开失败：无效的CameraId',
  [CreateCameraVideoTrackErrorCode.InvalidConfig]: '摄像头打开失败：无效的Config',
  [CreateCameraVideoTrackErrorCode.InvalidEncoderConfig]: '摄像头打开失败：无效的EncoderConfig',
  [CreateCameraVideoTrackErrorCode.InvalidOptimizationMode]: '摄像头打开失败：无效的OptimizationMode',
  [CreateCameraVideoTrackErrorCode.OpenCameraDeviceFailed]: '摄像头打开失败',
}

export const CREATE_AUDIO_TRACK_ERR_MSG = {
  [CreateMicrophoneAudioTrackErrorCode.InvalidConfig]: '麦克风打开失败：无效的Config',
  [CreateMicrophoneAudioTrackErrorCode.InvalidMicrophoneId]: '麦克风打开失败：无效的MicrophoneId',
  [CreateMicrophoneAudioTrackErrorCode.OpenMicDeviceFailed]: '麦克风打开失败',
}

export const JOIN_ERROR_MSG = {
  [JoinErrorCode.InvalidAppId]: '当前 AppId 不合法',
  [JoinErrorCode.InvalidChannelName]: '当前频道 ID 不合法',
  [JoinErrorCode.InvalidState]: 'SDK 状态不合法',
  [JoinErrorCode.InvalidUserId]: '当前用户 ID 不合法',
  [JoinErrorCode.ConnectServerFailed]: '连接服务器失败',
  [JoinErrorCode.FetchServersFailed]: '获取服务器列表失败',
}
