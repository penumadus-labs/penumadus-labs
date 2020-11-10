import { request, update } from './api'
import createRequestHook from './hooks/create-request-hook'

//* requests without dependencies

const verify = () => update('auth/verify')
const logout = () => update('auth/logout')

const [useLogin] = createRequestHook((username, password) =>
  update('auth/login', { username, password })
)

const [useRegisterDevice] = createRequestHook((data) =>
  update('database/register', data)
)

export default ({ requestAndStore, device, setDevice }) => {
  const initializeApi = async () => {
    //* calls that only need to be made once

    const devices = await requestAndStore(
      'devices',
      'database/devices',
      {},
      true
    )

    const storedId = localStorage.getItem('id')

    const device =
      (storedId && devices[storedId]) ||
      devices[Object.keys(devices)[0]] ||
      null

    setDevice(device)
  }

  //* returns if not authorized

  if (!device) return [[{ initializeApi, verify }, { useLogin }]]

  const { id, deviceType } = device

  //* stored requests

  const getProtocol = (params) =>
    requestAndStore(
      'protocol',
      'devices/protocol',
      { ...params, id, deviceType },
      true
    )

  const getSettings = (params) =>
    requestAndStore('settings', 'devices/settings', { ...params, id }, true)

  //* stored and manually updated requests

  const [
    useGetEnvironment,
    getEnvironment,
  ] = createRequestHook((params, storeError) =>
    requestAndStore(
      'environment',
      'database/environment',
      { ...params, id },
      storeError
    )
  )

  const [
    useGetAcceleration,
    getAcceleration,
  ] = createRequestHook((storeError) =>
    requestAndStore('acceleration', 'database/acceleration', { id }, storeError)
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

  const [useDownloadEnvironment] = createRequestHook((start, end) =>
    request('database/environment-csv', { id, start, end })
  )
  const [useDownloadAccelerationEvent] = createRequestHook((index) =>
    request('database/acceleration-event-csv', { id, index })
  )

  const [useDeleteEnvironment] = createRequestHook(() =>
    request('database/environment', { id }, 'delete')
  )

  const [useDeleteAcceleration] = createRequestHook(() =>
    request('database/acceleration', { id }, 'delete')
  )

  const [useCommand] = createRequestHook(async (command, args) =>
    update('devices/command', { id, command, args })
  )

  //* static requests

  const actions = {
    // initializeApi,
    getEnvironment,
    getAcceleration,
    getAccelerationEvent,
    getSettings,
    setDevice,
    logout,
  }

  const hooks = {
    useLogin,
    useRegisterDevice,
    useGetEnvironment,
    useGetAcceleration,
    useGetAccelerationEvent,
    useDownloadEnvironment,
    useDownloadAccelerationEvent,
    useDeleteEnvironment,
    useDeleteAcceleration,
    useCommand,
  }

  const mount = () => {
    getProtocol()
    getSettings()
    getEnvironment({}, true)
    getAcceleration(true)
    getAccelerationEvent(0, true)
  }

  return [[actions, hooks], mount]
}
