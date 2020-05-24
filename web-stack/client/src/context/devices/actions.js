import url from '../../utils/url'
import { create } from 'axios'

let devices

const ctx = {}

const initialize = async (token) => {
  if (!token) return
  if (ctx.state.loading) {
    devices = create({
      baseURL: url + 'api/devices/',
      headers: {
        token,
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json; text/plain',
      },
    })
  }
  try {
    await Promise.all([getProtocol(), getSettings()])
  } catch (error) {
    console.error(error)
  }
}

const getProtocol = async () => {
  // eslint-disable-next-line
  const { data } = await devices.get('protocol')
}

const getSettings = async (id) => {
  // eslint-disable-next-line
  const { data } = await devices.get('settings', { params: { id } })
}

const sendCommand = async (params) => {
  const { data } = await devices.post('command', params)
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
