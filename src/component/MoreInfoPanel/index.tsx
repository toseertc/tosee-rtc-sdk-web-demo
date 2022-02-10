import React, { useState } from 'react'
import { Select } from 'antd'

import SettingsListItem from '../SettingsListItem'
import './index.less'

const { Option } = Select

interface MoreInfoPanelProps {
  cameraId: string
  micId: string
  micDevices: MediaDeviceInfo[]
  cameraDevices: MediaDeviceInfo[]
  onSelectDevice: (
    deviceId: string,
    deviceType: MediaDeviceKind
  ) => Promise<void>
  onExit:()=>void
}

export default function MoreInfoPanel(props: MoreInfoPanelProps) {
  const {
    cameraId,
    micId,
    micDevices,
    cameraDevices,
    onSelectDevice,
    onExit,
  } = props

  const [selectingMic, setSelectingMic] = useState(false)
  const [selectingCamera, setSelectingCamera] = useState(false)

  const renderDevicesOptions = (devices: MediaDeviceInfo[]) => {
    const devicesOptions = devices.map((device) => {
      return (
        <Option key={device.deviceId} value={device.deviceId}>
          {device.label}
        </Option>
      )
    })

    return devicesOptions
  }

  return (
    <div className="ts-web-test-app-more-info-panel-wrapper">
      <div className="panel-container-wrapper">
        <div className="settings-item-title">设备选择</div>
        <div className="settings-items-wraper">
          <SettingsListItem name="摄像头" type="gray">
            <Select
              size="small"
              value={cameraId}
              style={{ width: '200px', color: '#929baa' }}
              onChange={(id) => {
                setSelectingCamera(true)
                onSelectDevice(id, 'videoinput').finally(() => {
                  setSelectingCamera(false)
                })
              }}
              loading={selectingCamera}
            >
              {renderDevicesOptions(cameraDevices)}
            </Select>
          </SettingsListItem>
          <SettingsListItem name="麦克风">
            <Select
              size="small"
              value={micId}
              style={{ width: '200px', color: '#929baa' }}
              onChange={(id) => {
                setSelectingMic(true)
                onSelectDevice(id, 'audioinput').finally(() => {
                  setSelectingMic(false)
                })
              }}
              loading={selectingMic}
            >
              {renderDevicesOptions(micDevices)}
            </Select>
          </SettingsListItem>
        </div>
        <div
          className="settings-exit-btn"
          onClick={onExit}
        >
          返回登录页面
        </div>
      </div>
    </div>
  )
}
