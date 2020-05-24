import url from '../../utils/url'
import { create } from 'axios'

let database

const ctx = {}

const initialize = (token, id = 'unit_3') => {
  if (!token) return
  if (ctx.state.loading) {
    database = create({
      baseURL: url + 'api/database/',
      headers: {
        token,
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json; text/plain',
      },
    })
  }
  if (!ctx.state.pressure) {
    getDeviceData(id)
  }
}

const getDeviceData = async (id) => {
  try {
    const { data } = await database.get('device-data', { params: { id } })
    ctx.dispatch({ type: 'data', data })
  } catch (error) {
    console.error(error)
  }
}

export const createActions = (state, dispatch) => {
  ctx.state = state
  ctx.dispatch = dispatch
  return {
    initialize,
  }
}
