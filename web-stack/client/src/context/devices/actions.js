import url from '../../utils/url'
import { create } from 'axios'

let devices

const ctx = {}

const initialize = async (token) => {
  if (!token) return
  try {
    if (ctx.state.loading) {
      devices = create({
        baseURL: url + 'api/devices/',
        headers: {
          token,
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/json; text/plain',
        },
      })

      const { data } = await devices.get('protocol')
      ctx.dispatch({ type: 'protocol', protocol: data })
    }
    await getSettings()
  } catch (error) {
    console.error(error)
    // ctx.dispatch({type: 'error'})
  }
}

const getSettings = async (id = 'unit_3') => {
  const { data } = await devices.get('settings', { params: { id } })
  ctx.dispatch({ type: 'settings', settings: data })
}

const sendCommand = async (id = 'unit_3', command, args = []) => {
  const { data } = await devices.post('command', { id, command, args })
  // await getSettings()
  return data
}

export const createActions = (state, dispatch) => {
  ctx.state = state
  ctx.dispatch = dispatch
  return {
    initialize,
    sendCommand,
  }
}
