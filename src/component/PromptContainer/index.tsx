import React from 'react'
import _ from 'lodash'

import './index.less'

interface PromptContainerProps {
  style?: Object,
  show: boolean,
}

function PromptContainer({ style, show }: PromptContainerProps) {
  const fixedStyle = _.assign({}, style, {
    display: show ? 'flex' : 'none',
  })

  return (
    <div id="ts-web-test-app-prompt-container" style={fixedStyle} />
  )
}

PromptContainer.defaultProps = {
  style: {},
}

export default PromptContainer
