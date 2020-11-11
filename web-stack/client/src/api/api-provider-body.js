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
      { deviceType: 'bridge' },
      true
    )

    const storedId = localStorage.getItem('id')

    const device = (storedId && devices[storedId]) || devices.list[0] || null

    setDevice(device)
  }

  //* returns if not authorized

  if (!device) return [{ initializeApi, verify }, { useLogin }]

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

  const [useGetEnvironment, getEnvironment] = createRequestHook((storeError) =>
    requestAndStore(
      'environment',
      'database/linear-data',
      { id, field: '$environment' },
      storeError
    )
  )

  const [useGetDeflection, getDeflection] = createRequestHook((storeError) =>
    requestAndStore(
      'deflection',
      'database/linear-data',
      { id, field: '$deflection' },
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

  const getAcceleration = () => {
    requestAndStore('acceleration', 'database/acceleration', { id }, true)
    getAccelerationEvent(0, true)
  }

  //* non-stored requests

  const [useDownloadEnvironment] = createRequestHook((start, end) =>
    request('database/linear-data-csv', { id, start, end })
  )
  const [useDownloadDeflection] = createRequestHook((start, end) =>
    request('database/linear-data-csv', { id, start, end })
  )
  const [useDownloadAccelerationEvent] = createRequestHook((index) =>
    request('database/acceleration-event-csv', { id, index })
  )

  const [useDeleteEnvironment] = createRequestHook(() =>
    request('database/data', { id, field: '$environment' }, 'delete')
  )
  const [useDeleteDeflection] = createRequestHook(() =>
    request('database/data', { id, field: '$deflection' }, 'delete')
  )
  const [useDeleteAcceleration] = createRequestHook(() =>
    request('database/data', { id, field: '$acceleration' }, 'delete')
  )

  const [useCommand] = createRequestHook(async (command, args) =>
    update('devices/command', { id, command, args })
  )

  //* static requests

  const actions = {
    // initializeApi,
    getProtocol,
    getEnvironment,
    getDeflection,
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
    useGetDeflection,
    useGetAccelerationEvent,
    useDownloadEnvironment,
    useDownloadDeflection,
    useDownloadAccelerationEvent,
    useDeleteEnvironment,
    useDeleteDeflection,
    useDeleteAcceleration,
    useCommand,
  }

  return [actions, hooks]
}
