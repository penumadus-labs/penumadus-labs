import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react'
import axios from 'axios'
import Loading from './loading'
import { Error, InlineError } from './error'

const baseURL = `${window.location.protocol}//${window.location.hostname}:8080/api/`

export const api = axios.create({
  baseURL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json; text/plain',
  },
})

export const setToken = (token) => {
  api.defaults.headers.token = token
}

const query = async (url, params) => {
  const { data } = await api.get(url, { params })
  return data
}

const handleError = (error) => error.response?.statusText || error.toString()

const apiContext = createContext()
const { Provider } = apiContext

const initialStatus = [<Loading />]

const initialState = {
  selected: null,
  protocol: initialStatus,
  deviceList: initialStatus,
  standardData: initialStatus,
  accelerationData: initialStatus,
  settings: initialStatus,
}

const useGlobalState = (initialState) => {
  const [state, setState] = useState(initialState)

  const set = useCallback((obj) => {
    setState((state) => ({
      ...state,
      ...obj,
    }))
  }, [])

  return [state, set]
}

export const ApiProvider = ({ children }) => {
  const [state, setState] = useGlobalState(initialState)

  const { current: id } = state

  const [actions, hooks] = useMemo(() => {
    const queryAndStore = async (key, url, params, catchError = false) => {
      try {
        const data = await query(url, params)
        setState({
          [key]: [null, data],
        })
        return data
      } catch (error) {
        if (catchError) {
          const errorText = handleError(error)
          setState({
            [key]: [<Error error={errorText} />],
          })
        }
      }
    }

    const getStandardData = (params, catchError) =>
      queryAndStore(
        'standardData',
        'database/device-standard-data',
        { ...params, id },
        catchError
      )

    const getAccelerationData = (params, catchError) =>
      queryAndStore(
        'accelerationData',
        'database/device-acceleration-data',
        { ...params, id },
        catchError
      )

    const getSettings = (params, catchError) =>
      queryAndStore('settings', 'devices/settings', params, catchError)

    const getAll = async (id) => {
      getStandardData(id, true)
      getAccelerationData(id, true)
      getSettings(id, true)
    }

    const initializeApi = async (token) => {
      setToken(token)

      let id
      try {
        const promises = [
          query('database/device-list'),
          query('devices/protocol'),
        ]
        const [deviceList, protocol] = await Promise.all(promises)

        id = deviceList[0]

        setState({
          selected: id,
          deviceList: [null, deviceList],
          protocol: [null, protocol],
        })
      } catch (error) {
        const errorText = handleError(error)
        setState({
          deviceList: [<Error error={errorText} />],
          protocol: [<Error error={errorText} />],
        })
      } finally {
        getAll(id)
      }
    }

    if (!id) return [{}, {}]

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
      initializeApi,
      getStandardData,
      getAccelerationData,
      getAll,
    }

    const hooks = {
      useGetStandardData,
      useGetAccelerationData,
      useDownloadStandardData,
      useDownloadAccelerationData,
      useSendCommand,
      useSendSetting,
    }

    return [actions, hooks]
  }, [id, setState])

  return <Provider value={[state, actions, hooks]}>{children}</Provider>
}

export default () => useContext(apiContext)

export const createRequestHook = (promise) => () => {
  const [state, setState] = useState({})

  const { loading, success, error } = state

  const setLoading = () => {
    setState({ loading: true })
  }
  const setSuccess = () => {
    setState({ success: true })
  }
  const setError = (error) => {
    setState({ error })
  }

  const request = async (...args) => {
    try {
      setLoading()
      await promise(...args)
      setSuccess()
    } catch (error) {
      setError(handleError(error))
    }
  }

  const status = loading ? (
    <Loading />
  ) : success ? (
    <p className="success">success</p>
  ) : error ? (
    <InlineError error={error} />
  ) : null

  return [status, request, state, setError]
}
