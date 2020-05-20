import * as api from '../../utils/api'

/* 
wrapper around React's default dispatch function returned from useReducer
to allow async data fetching before updating context
 */

const ctx = {}

const initialize = () => {}

const getDevices = async () => {
  try {
    const [devices, settings, data] = await Promise.all([
      api.getDevices(),
      api.getSettings(),
      api.getData(),
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
    ctx.dispatch({ type: 'get-data', data })
  } catch (error) {}
}

const updateSettings = async (settings) => {
  // await api.post()
  ctx.disptach({ type: 'update-settings', settings })
}

const selectDevice = (name) => {
  ctx.disptach({ type: 'select-device', name })
}

export const createActions = (dispatch) => {
  ctx.dispatch = dispatch
  return {
    initialize,
    getData,
    updateSettings,
    selectDevice,
    getDevices,
  }
}
