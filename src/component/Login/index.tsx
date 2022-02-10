import React, { useState } from 'react'
import _ from 'lodash'
import CX from 'classnames'

import './index.less'

const loginText = {
  channel: { text: '频道 ID', tip: '（请输入频道ID）' },
  user: { text: '用户 ID', tip: '（请输入用户ID）' },
}

interface LoginProps {
  channelId: string
  userId: string
  onLogin: (channelId: string, userId: string) => void
  onChannelIdChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onUserIdChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Login(props: LoginProps) {
  const {
    channelId,
    userId,
    onLogin,
    onChannelIdChange,
    onUserIdChange,
  } = props

  const [isChannelIdCheckFail, setIsChannelIdCheckFail] = useState(false)
  const [isUserIdCheckFail, setIsUserIdCheckFail] = useState(false)

  const renderLabel = (
    { text, tip },
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    isShowError: boolean,
    value: string,
  ) => {
    return (
      <div className="login-item">
        <div className="label">
          <span className="label-text">{text}</span>
          {isShowError && <span className="label-error-tip">{tip}</span>}
        </div>
        <input
          type="text"
          className={CX({ 'input-content': true, 'error-tip': isShowError })}
          onChange={handleChange}
          value={value}
        />
      </div>
    )
  }

  const handleChannelIdChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsChannelIdCheckFail(false)
    onChannelIdChange(event)
  }

  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUserIdCheckFail(false)
    onUserIdChange(event)
  }

  const handleLogin = () => {
    const isChannelIdEmpty = _.isEmpty(channelId)
    if (isChannelIdEmpty) {
      setIsChannelIdCheckFail(true)
    }
    const isUserIdEmpty = _.isEmpty(userId)
    if (isUserIdEmpty) {
      setIsUserIdCheckFail(true)
    }
    if (isChannelIdCheckFail || isUserIdCheckFail) {
      return
    }
    onLogin(channelId, userId)
  }

  return (
    <div className="ts-web-test-app-login-wrapper">
      {renderLabel(
        loginText.channel,
        handleChannelIdChange,
        isChannelIdCheckFail,
        channelId,
      )}
      {renderLabel(
        loginText.user,
        handleUserIdChange,
        isUserIdCheckFail,
        userId,
      )}
      <div
        className={CX({ 'login-button': true })}
        role="button"
        tabIndex={0}
        onClick={handleLogin}
      >
        <span className="text">进入频道</span>
      </div>
    </div>
  )
}
