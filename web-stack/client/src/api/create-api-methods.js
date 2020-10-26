import { api, getRequest } from './api'
import createRequestHook from './hooks/create-request-hook'

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
  ] = createRequestHook((storeError) =>
    requestAndStore(
      'accelerationEvents',
      'database/acceleration-events',
      { id },
      storeError
    )
  )

  const [
    useGetAccelerationEvent,
    getAccelerationEvent,
  ] = createRequestHook((index, storeError) =>
    requestAndStore(
      'accelerationEvent',
      'database/acceleration-event',
      { index, id },
      storeError
    )
  )

  //* non-stored requests

  const [useDownloadStandardData] = createRequestHook((start, end) =>
    getRequest('database/standard-csv', { id, start, end })
  )
  const [useDownloadAccelerationEvent] = createRequestHook((index) =>
    getRequest('database/acceleration-csv', { id, index })
  )

  const [useDeleteStandardData] = createRequestHook(() =>
    api.delete('database/standard', { params: { id } })
  )

  const [useDeleteAccelerationEvents] = createRequestHook(() =>
    api.delete('database/acceleration', { params: { id } })
  )

  // const [useCommand] = createRequestHook((command) =>
  //   api.post('devices/command', { id, command })
  // )
  const [useCommand] = createRequestHook(async (command, args) =>
    api.post('devices/command', { id, command, args })
  )

  const actions = {
    // initializeApi,
    getStandardData,
    getAccelerationEvents,
    getAccelerationEvent,
    getSettings,
    setId,
  }

  const hooks = {
    useLogin,
    useRegisterDevice,
    useGetStandardData,
    useGetAccelerationEvents,
    useGetAccelerationEvent,
    useDownloadStandardData,
    useDownloadAccelerationEvent,
    useDeleteStandardData,
    useDeleteAccelerationEvents,
    useCommand,
  }

  const mount = () => {
    getSettings({}, true)
    getStandardData({}, true)
    getAccelerationEvents(true)
    getAccelerationEvent(0, true)
  }

  return [[actions, hooks], mount]
}
