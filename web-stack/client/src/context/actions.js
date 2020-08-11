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
        'database/device-standard-data',
        { ...params, id },
        storeError
      )

    const getAccelerationData = (params, storeError) =>
      requestAndStore(
        'accelerationData',
        'database/device-acceleration-data',
        { ...params, id },
        storeError
      )

    const getSettings = (params, storeError) =>
      requestAndStore('settings', 'devices/settings', params, storeError)

    const useGetStandardData = createRequestHook(getStandardData)
    const useGetAccelerationData = createRequestHook(getAccelerationData)
    const useDownloadStandardData = createRequestHook((start, end) =>
      query('database/device-standard-data', { id, start, end })
    )
    const useDownloadAccelerationData = createRequestHook((start, end) =>
      query('database/device-accleration-data', { id, start, end })
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
      useGetAccelerationData,
      useDownloadStandardData,
      useDownloadAccelerationData,
      useSendCommand,
      useSendSetting,
    }

    const effect = () => {
      getStandardData({}, true)
      getAccelerationData({}, true)
      getSettings({}, true)
    }

    return [actions, hooks, effect]
    // eslint-disable-next-line
  }, [id, requestAndStore])
}
