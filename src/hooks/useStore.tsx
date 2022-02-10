import { useState, useEffect } from 'react'
import { autorun, isObservable } from 'mobx'
import _ from 'lodash'

function getPlainData(store, path: string) {
  let data = _.get(store, path, null)
  if (isObservable(data)) {
    data = data.toJSON()
  }
  return data
}

export default function useStore<T, K extends keyof T>(store: T, path: K) {
  const [state, setState] = useState(getPlainData(store, path))

  useEffect(() => {
    return autorun(() => {
      const storeValue = getPlainData(store, path)
      if (_.isEqual(storeValue, state) === false) {
        setState(storeValue)
      }
    })
  })

  return state
}
