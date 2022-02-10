import React, { useState, useEffect } from 'react'
import { ClientMode } from 'ts-rtc-sdk-web'

import {
  LoginLayout,
  Login,
} from '../../component'
import store from '../../store'
import useStore from '../../hooks/useStore'
import { TsRTC, createClient } from '../../ts-rtc-sdk'
import { addListeners, initConfigs } from '../../sdkUtils/mediaConnect'

export default function LoginLayoutHoc() {
  const channelId = useStore(store, 'channelId')
  const userId = useStore(store, 'selfUid')
  const [loginStatus, setLoginStatus] = useState('')

  const handleChannelIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.update({ channelId: event.target.value })
    setLoginStatus('')
  }

  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.update({ selfUid: event.target.value })
    setLoginStatus('')
  }

  const handleLogin = () => {
    if (loginStatus === '正在进入...') {
      return
    }
    setLoginStatus('正在进入...')

    let client = null
    try {
      client = createClient({
        mode: Number(ClientMode.Communicate),
      })
    } catch (error) {
      setLoginStatus(error.message)
      return
    }

    addListeners()

    client
      .join('Drv4Q0KB14Y85qma', channelId, userId)
      .then(() => {
        store.setSelfUid(client.getSelfUid())
        store.setJoinnedChannel(true)
        initConfigs()
      })
      .catch((e) => {
        console.log('joined channel err', e)
        store.promptStore.setLoginFailed(true, e.code)
      }).finally(() => {
        setLoginStatus('')
      })
  }

  useEffect(() => {
    store.reset()
    TsRTC.getCameras(true).catch((e) => { console.log('get cameras error', e.message) })
    TsRTC.getMicrophones(true).catch((e) => { console.log('get mics error', e.message) })
  }, [])

  return (
    <LoginLayout
      Login={(
        <Login
          userId={userId}
          channelId={channelId}
          onLogin={handleLogin}
          onChannelIdChange={handleChannelIdChange}
          onUserIdChange={handleUserIdChange}
        />
          )}
    />
  )
}
