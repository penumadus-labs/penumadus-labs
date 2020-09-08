import { api, getRequest } from './api-base'
import createRequestHook from './create-request-hook'

export default ({ requestAndStore, idState: [id, setId] }) => {
  const initializeApi = async () => {
    // calls that only need to be made once
    const [deviceList = []] = await Promise.all([
      requestAndStore('deviceList', 'database/device-list', {}, true),
      requestAndStore('protocol', 'devices/protocol', {}, true),
    ])

    setId(deviceList[0] || null)
  }

  if (!id) return [[{ initializeApi }]]

  // stored requests

  const getSettings = (params, storeError) =>
    requestAndStore(
      'settings',
      'devices/settings',
      { ...params, id },
      storeError
    )

  // stored and manually updated requests

  const [
    useGetStandardData,
    getStandardData,
  ] = createRequestHook((params, storeError) =>
    requestAndStore(
      'standardData',
      'database/standard-data',
      { ...params, id },
      storeError
    )
  )
  const [
    useGetAccelerationEvents,
    getAccelerationEvents,
  ] = createRequestHook((params, storeError) =>
    requestAndStore(
      'accelerationEvents',
      'database/acceleration-events',
      { ...params, id },
      storeError
    )
  )

  // non-stored requests

  const [useGetAccelerationData] = createRequestHook((params, storeError) =>
    getRequest('database/acceleration-data', { ...params, id })
  )

  const [useDownloadStandardData] = createRequestHook((start, end) =>
    getRequest('database/standard-csv', { id, start, end })
  )
  const [useDownloadAccelerationData] = createRequestHook((index) =>
    getRequest('database/acceleration-csv', { id, index })
  )

  const [useSendCommand] = createRequestHook((command) =>
    api.post('devices/command', { id, command })
  )
  const [useSendSetting] = createRequestHook(async (command, args) => {
    await api.post('devices/command', { id, command, args })
    await getSettings()
  })

  const actions = {
    getStandardData,
    getAccelerationEvents,
    setId,
  }

  const hooks = {
    initializeApi,
    useGetStandardData,
    useGetAccelerationEvents,
    useGetAccelerationData,
    useDownloadStandardData,
    useDownloadAccelerationData,
    useSendCommand,
    useSendSetting,
  }

  const mount = () => {
    getSettings({}, true)
    getStandardData({}, true)
    getAccelerationEvents({}, true)
  }

  return [[actions, hooks], mount]
}
