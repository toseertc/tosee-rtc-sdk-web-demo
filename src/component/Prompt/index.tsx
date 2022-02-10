import React from 'react'
import ReactDOM from 'react-dom'

import './index.less'

export interface PromptProps {
  title: string
  content: string
  buttonText: string
  onClickMainButton: () => void
  canClose?: boolean
  onClose?: () => void
}
export default function Prompt({
  title,
  content,
  buttonText,
  onClickMainButton,
  canClose,
  onClose,
}: PromptProps) {
  return ReactDOM.createPortal(
    <div className="ts-web-test-app-prompt-wrap">
      <div className="content-wrap">
        <div className="title">
          <span className="text">{title}</span>
          {canClose && (
          <div className="close-btn" onClick={onClose}>
            <i className="close-icon" />
          </div>
          )}
        </div>
        <div className="content">{content}</div>
        <div className="main-btn" onClick={onClickMainButton}>
          {buttonText}
        </div>
      </div>
    </div>,
    document.getElementById('ts-web-test-app-prompt-container'),
  )
}

Prompt.defaultProps = {
  canClose: false,
  onClose: () => {},
}
