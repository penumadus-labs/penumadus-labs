import { api, getRequest } from './api-base'
import createRequestHook from './create-request-hook'

//* requests without dependencies

const login = (username, password) =>
  api.post('auth/login', { username, password }, { timeout: 3000 })

const [useLogin] = createRequestHook(login)

const registerDevice = (data) => api.post('database/register', data)

const [useRegisterDevice] = createRequestHook(registerDevice)

export default ({ requestAndStore, id, setId }) => {
  const initializeApi = async () => {
    //* calls that only need to be made once

    const list = requestAndStore('deviceList', 'database/device-list', {}, true)
    const protocol = requestAndStore('protocol', 'devices/protocol', {}, true)

    const [deviceList = []] = await Promise.all([list, protocol])

    const storedId = localStorage.getItem('id')

    setId((deviceList.includes(storedId) && storedId) || deviceList[0] || null)
  }

  //* returns if not authorized

  if (!id) return [[{ initializeApi }, { useLogin }]]

  //* stored requests

  const getSettings = (params, storeError) =>
    requestAndStore(
      'settings',
      'devices/settings',
      { ...params, id },
      storeError
    )

  //* stored and manually updated requests

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

  //* non-stored requests

  const [useGetAccelerationData] = createRequestHook((params) =>
    getRequest('database/acceleration-data', { ...params, id })
  )

  const [useDownloadStandardData] = createRequestHook((start, end) =>
    getRequest('database/standard-csv', { id, start, end })
  )
  const [useDownloadAccelerationData] = createRequestHook((index) =>
    getRequest('database/acceleration-csv', { id, index })
  )

  const [useDeleteStandardData] = createRequestHook(() =>
    api.delete('database/standard', { params: { id } })
  )

  const [useDeleteAccelerationEvents] = createRequestHook(() =>
    api.delete('database/acceleration', { params: { id } })
  )

  const [useSendCommand] = createRequestHook((command) =>
    api.post('devices/command', { id, command })
  )
  const [useSendSetting] = createRequestHook(async (command, args) => {
    await api.post('devices/command', { id, command, args })
    await getSettings()
  })

  const actions = {
    // initializeApi,
    getStandardData,
    getAccelerationEvents,
    getSettings,
    setId,
  }

  const hooks = {
    useLogin,
    useRegisterDevice,
    useGetStandardData,
    useGetAccelerationEvents,
    useGetAccelerationData,
    useDownloadStandardData,
    useDownloadAccelerationData,
    useDeleteStandardData,
    useDeleteAccelerationEvents,
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
