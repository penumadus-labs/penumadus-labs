import { request, update } from './api'
import createRequestHook from './hooks/create-request-hook'
import { resolution } from '../utils/live-data-config'

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
    //* top level calls that only need to be made once

    const devices = await requestAndStore(
      'devices',
      'database/devices',
      { deviceType: 'bridge' },
      true
    )

    devices.list = Object.values(devices)

    const storedId = localStorage.getItem('id')

    const device = (storedId && devices[storedId]) || devices.list[0] || null

    setDevice(device)
  }

  //* returns if not authorized

  if (!device) return [{ initializeApi, verify }, { useLogin }]

  const { id, deviceType } = device

  //* top level requests

  const getProtocol = (params) =>
    requestAndStore(
      'protocol',
      'devices/protocol',
      { ...params, id, deviceType },
      true
    )

  const getSettings = () =>
    requestAndStore('settings', 'devices/settings', { id }, true)

  //* top level and manually updated requests

  const [useGetEnvironment, getEnvironment] = createRequestHook(
    (params, storeError) =>
      requestAndStore(
        'environment',
        'database/linear-data',
        {
          ...params,
          id,
          deviceType,
          field: 'environment',
          resolution,
        },
        storeError
      )
  )

  const [useGetDeflection, getDeflection] = createRequestHook(
    (params, storeError) =>
      requestAndStore(
        'deflection',
        'database/linear-data',
        {
          ...params,
          id,
          deviceType,
          field: 'deflection',
          resolution,
        },
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
      { index, id, deviceType },
      storeError
    )
  )

  const getAcceleration = () => {
    requestAndStore('acceleration', 'database/acceleration', { id }, true)
    getAccelerationEvent(0, true)
  }

  //* local requests requests

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
    request('database/data', { id, field: 'environment' }, 'delete')
  )
  const [useDeleteDeflection] = createRequestHook(() =>
    request('database/data', { id, field: 'deflection' }, 'delete')
  )
  const [useDeleteAcceleration] = createRequestHook(() =>
    request('database/data', { id, field: 'acceleration' }, 'delete')
  )

  const [useCommand] = createRequestHook(async (command, args) =>
    update('devices/command', { id, command, args })
  )

  const actions = {
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
