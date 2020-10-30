import { request, update } from './api'
import createRequestHook from './hooks/create-request-hook'

//* requests without dependencies

const verify = () => update('auth/verify')

const [useLogin] = createRequestHook((username, password) =>
  update('auth/login', { username, password })
)

const [useRegisterDevice] = createRequestHook((data) =>
  update('database/register', data)
)

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

  if (!id) return [[{ initializeApi, verify }, { useLogin }]]

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
    request('database/standard-csv', { id, start, end })
  )
  const [useDownloadAccelerationEvent] = createRequestHook((index) =>
    request('database/acceleration-csv', { id, index })
  )

  const [useDeleteStandardData] = createRequestHook(() =>
    request('database/standard', { id }, 'delete')
  )

  const [useDeleteAccelerationEvents] = createRequestHook(() =>
    request('database/acceleration', { id }, 'delete')
  )

  const [useCommand] = createRequestHook(async (command, args) =>
    update('devices/command', { id, command, args })
  )

  //* static requests
  const logout = async () => {
    await update('auth/logout')
    setId(null)
  }

  const actions = {
    // initializeApi,
    getStandardData,
    getAccelerationEvents,
    getAccelerationEvent,
    getSettings,
    setId,
    logout,
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
