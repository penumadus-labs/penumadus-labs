import { useMemo } from 'react'
import { createRequestHook, api, setToken, query } from './api-requests'

export default (id, setId, requestAndStore) => {
  return useMemo(() => {
    const initializeApi = async (token) => {
      setToken(token)

      const promises = [
        requestAndStore('deviceList', 'database/device-list', {}, true),
        requestAndStore('protocol', 'devices/protocol', {}, true),
      ]
      const [deviceList = []] = await Promise.all(promises)

      const id = deviceList[0] || null

      setId(id)
    }

    if (!id) return [{ initializeApi }, {}, () => {}]

    const getStandardData = (params, storeError) =>
      requestAndStore(
        'standardData',
        'database/standard-data',
        { ...params, id },
        storeError
      )

    const getAccelerationEvents = (params, storeError) =>
      requestAndStore(
        'accelerationEvents',
        'database/acceleration-events',
        { ...params, id },
        storeError
      )

    const getAccelerationData = (params, storeError) =>
      requestAndStore(
        'accelerationData',
        'database/acceleration-data',
        { ...params, id },
        storeError
      )

    const getSettings = (params, storeError) =>
      requestAndStore('settings', 'devices/settings', params, storeError)

    const useGetStandardData = createRequestHook(getStandardData)
    const useGetAccelerationEvents = createRequestHook(getAccelerationEvents)
    const useGetAccelerationData = createRequestHook(getAccelerationData)
    const useDownloadStandardData = createRequestHook((start, end) =>
      query('database/standard-data', { id, start, end })
    )
    const useDownloadAccelerationData = createRequestHook((start, end) =>
      query('database/accleration-data', { id, start, end })
    )

    const sendCommand = (command, args) =>
      api.post('devices/command', { id, command, args })

    const useSendCommand = createRequestHook((command) => sendCommand(command))
    const useSendSetting = createRequestHook(async (command, args) => {
      await sendCommand(command, args)
      await getSettings()
    })

    const actions = {
      getStandardData,
      getAccelerationData,
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

    const effect = () => {
      getSettings({}, true)
      getStandardData({}, true)
      getAccelerationEvents({}, true).then(([time]) =>
        getAccelerationData({ time }, true)
      )
    }

    return [actions, hooks, effect]
    // eslint-disable-next-line
  }, [id, requestAndStore])
}
