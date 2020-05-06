import * as api from '../../utils/api'

/* 
wrapper around React's default dispatch function returned from useReducer
to allow async data fetching before updating context
 */

const ctx = {}

const getDevices = async () => {
  try {
    const [devices, settings, data] = await Promise.all([
      getDevices(),
      getSettings(),
      getData(),
    ])

    ctx.disptach({ type: 'get-devices', devices, settings, data })
  } catch (error) {
    console.error(error)
    ctx.disptach({ type: 'error', error: error.toString() })
  }
}

const getData = async () => {
  try {
    const data = await api.getData()
    dispatch({ type: 'get-data', data })
  } catch (error) {}
}

const updateSettings = async (settings) => {
  // await axios.post()
  ctx.disptach({ type: 'update-settings', settings })
}

const selectDevice = (name) => {
  ctx.disptach({ type: 'select-device', name })
}

export const createActions = (disptach) => {
  ctx.dispatch = dispatch
  return {
    initialize,
  }
}
