import {
  TsRTC,
  ITsRTCClient,
  LogLevel,
  CreateClientConfig,
} from 'ts-rtc-sdk-web'

// eslint-disable-next-line import/no-mutable-exports
let client: ITsRTCClient = null
const tsCreatClient = TsRTC.createClient

const createClient = (config: CreateClientConfig) => {
  client = tsCreatClient({
    mode: config.mode,
    webServers: ['https://rtc-api.tosee.cn'],
    streamServers: [],
    signalServers: [],
    logServers: ['https://data-center.tosee.cn'],
  })
  window.client = client
  return client
}

function getClient() {
  return client
}

TsRTC.setLogLevel(LogLevel.Debug)

export {
  createClient,
  TsRTC,
  getClient,
}
