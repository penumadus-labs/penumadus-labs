import { request, update } from './api'
import createRequestHook from './hooks/create-request-hook'
import { dataLimit as limit } from '../utils/config'

//* requests without dependencies

const verify = () => update('auth/verify')
const logout = () => update('auth/logout')

const [useLogin] = createRequestHook((username, password) =>
  update('auth/login', { username, password })
)

const [useRegisterDevice] = createRequestHook((data) =>
  update('database/register', data)
)

export default function ApiProvider({ requestAndStore, device, setDevice }) {
  const initializeApi = async () => {
    //* top level calls that only need to be made once
    const devices = await requestAndStore(
      'devices',
      'database/devices',
      { deviceType: 'bridge' },
      true
    )

    // move morgan bridge to the front
    devices.list = Object.values(devices).reduce(
      (a, value) =>
        value.id === 'morganbridge' ? [value, ...a] : [...a, value],
      []
    )

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
      { id, deviceType, ...params },
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
          id,
          deviceType,
          field: 'environment',
          limit,
          ...params,
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
          id,
          deviceType,
          field: 'deflection',
          limit,
          ...params,
        },
        storeError
      )
  )

  const [
    useGetAccelerationEvent,
    getAccelerationEvent,
  ] = createRequestHook((time, storeError) =>
    requestAndStore(
      'accelerationEvent',
      'database/acceleration-event',
      { time, id, deviceType },
      storeError
    )
  )

  const getAcceleration = () => {
    requestAndStore('acceleration', 'database/acceleration', { id }, true)
    getAccelerationEvent(null, true)
  }

  //* local requests requests
  const [useDownloadEnvironment] = createRequestHook((start, end) =>
    request('database/linear-data-csv', {
      field: 'environment',
      id,
      start,
      end,
    })
  )
  const [useDownloadDeflection] = createRequestHook((start, end) =>
    request('database/linear-data-csv', { field: 'deflection', id, start, end })
  )
  const [useDownloadAccelerationEvent] = createRequestHook((time) =>
    request('database/acceleration-event-csv', {
      field: 'acceleration',
      id,
      time,
    })
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

  const [useCommand] = createRequestHook(async (command, data) =>
    update('devices/command', { id, command, data })
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
