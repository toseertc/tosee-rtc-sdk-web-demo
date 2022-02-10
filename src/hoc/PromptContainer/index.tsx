import React from 'react'

import { JOIN_ERROR_MSG } from '../../const'
import PromptContainer from '../../component/PromptContainer'
import Prompt from '../../component/Prompt'
import useStore from '../../hooks/useStore'
import store from '../../store'
import { disconnect } from '../../sdkUtils/mediaConnect'

export default function PromptContainerHoc() {
  const showPrompt = useStore(store, 'showPrompt')
  const kickOut = useStore(store.promptStore, 'kickOut')
  const connectFailed = useStore(store.promptStore, 'connectFailed')
  const isLoginFailed = useStore(store.promptStore.loginFailed, 'isFailed')
  const loginErrorCode = useStore(store.promptStore.loginFailed, 'errorCode')

  const handelLoginFailed = () => {
    store.promptStore.setLoginFailed(false)
  }

  const handleKickOut = () => {
    disconnect()
    store.promptStore.setKickOut(false)
  }

  const handleConnectFailed = () => {
    disconnect()
    store.promptStore.setConnectFailed(false)
  }

  return (
    <>
      <PromptContainer show={showPrompt} />
      {
        kickOut && (
          <Prompt
            title="已断开连接"
            content="检测到您在其他设备登录,请返回登录后重试。"
            buttonText="返回登录页面"
            onClickMainButton={handleKickOut}
            onClose={() => { store.promptStore.setKickOut(false) }}
            canClose
          />
        )
      }
      {
        connectFailed && (
          <Prompt
            title="连接已断开"
            content="网络连接丢失"
            buttonText="返回登录页面"
            onClickMainButton={handleConnectFailed}
            onClose={() => { store.promptStore.setConnectFailed(false) }}
            canClose
          />
        )
      }
      {
        isLoginFailed && (
          <Prompt
            title="进入频道失败"
            content={JOIN_ERROR_MSG[loginErrorCode]}
            buttonText="确定"
            onClickMainButton={handelLoginFailed}
          />
        )
      }
    </>
  )
}
