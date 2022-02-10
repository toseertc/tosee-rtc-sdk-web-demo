import store from '../store'

let timeFlag

const addTempTip = (tip: string) => {
  clearTimeout(timeFlag)
  store.setMediaTip(tip)
  setTimeout(() => {
    store.setMediaTip('')
  }, 3000)
}

const setTip = (tip: string) => {
  store.setMediaTip(tip)
}

export {
  addTempTip,
  setTip,
}
