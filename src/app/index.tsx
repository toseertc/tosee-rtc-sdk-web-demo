import React from 'react'
import { observer } from 'mobx-react'

import ChannelLayout from '../hoc/ChannelLayout'
import LoginLayout from '../hoc/LoginLayout'
import PromptContainer from '../hoc/PromptContainer'
import store from '../store'

import './index.less'

@observer
class App extends React.Component {
  componentDidCatch(error) {
    console.log('app catch an error', error.message)
  }

  render() {
    return (
      <div className="app-component-wrap">
        {
        store.joinedChannel ? (
          <ChannelLayout />
        ) : (
          <LoginLayout />
        )
          }
        <PromptContainer />
      </div>
    )
  }
}

export default App
