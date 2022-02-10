import React, { useEffect, useState } from 'react'

import { MoreInfoPanel } from '../../component'
import store from '../../store'
import useStore from '../../hooks/useStore'
import { TsRTC } from '../../ts-rtc-sdk'
import { setCamera, setMic } from '../../sdkUtils/trackUtils'
import { addTempTip } from '../../utils/mediaTipUpdater'
import { disconnect } from '../../sdkUtils/mediaConnect'

export default function MoreInfoPanelHoc() {
  const cameraId = useStore(store.settingsStore, 'cameraId')
  const micId = useStore(store.settingsStore, 'micId')
  const [micDevices, setMicDevices] = useState([])
  const [cameraDevices, setCameraDevices] = useState([])

  useEffect(() => {
    async function getDevices() {
      let mics = []
      try {
        mics = await TsRTC.getMicrophones(false)
      } catch (error) {
        console.log(`comp:pubstreamsettings, getMicroPhones(false), error:${error.msg}`)
      }

      let cameras = []
      try {
        cameras = await TsRTC.getCameras(false)
      } catch (error) {
        console.log(`comp:pubstreamsettings, getCameras(false), error:${error.msg}`)
      }

      setCameraDevices(cameras)
      setMicDevices(mics)
    }

    getDevices()
  }, [])

  const handleSelectDevice = (
    deviceId: string,
    deviceType: MediaDeviceKind,
  ) => {
    if (deviceType === 'videoinput') {
      return setCamera(deviceId).catch(() => { addTempTip('设置设备失败') })
    }
    return setMic(deviceId).catch(() => { addTempTip('设置设备失败') })
  }

  const handleExitChannel = () => {
    disconnect()
  }

  return (
    <MoreInfoPanel
      micDevices={micDevices}
      cameraDevices={cameraDevices}
      cameraId={cameraId}
      micId={micId}
      onSelectDevice={handleSelectDevice}
      onExit={handleExitChannel}
    />
  )
}
