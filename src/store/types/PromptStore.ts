import { types } from 'mobx-state-tree'
/* eslint-disable no-param-reassign */
import BaseType from './BaseType'

const PromptStore = BaseType.named('PromptStore').props({
  kickOut: types.boolean,
  connectFailed: types.boolean,
  loginFailed: types.model({
    isFailed: types.boolean,
    errorCode: types.number,
  }),
}).views((self) => ({
  get showPrompt() {
    return self.kickOut || self.connectFailed || self.loginFailed.isFailed
  },
})).actions((self) => ({
  setKickOut(kickOut: boolean) {
    self.kickOut = kickOut
  },
  setConnectFailed(failed: boolean) {
    self.connectFailed = failed
  },
  setLoginFailed(failed: boolean, errorCode = 1) {
    self.loginFailed.isFailed = failed
    self.loginFailed.errorCode = errorCode
  },
}))
export default PromptStore
