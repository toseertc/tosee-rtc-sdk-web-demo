/* eslint-disable no-param-reassign */
import {
  types,
} from 'mobx-state-tree'
import BaseType from './BaseType'

const RemoteUser = BaseType.named('RemoteUser').props({
  uid: types.string,
})

export default RemoteUser
