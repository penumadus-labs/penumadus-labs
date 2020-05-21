import url from '../../utils/url'

import { create } from 'axios'

let database

const ctx = {}

const initialize = async (token) => {
  if (!token) return
  database = create({
    baseURL: url + 'api/database/',
    headers: {
      token,
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json; text/plain',
    },
  })
  try {
    await getDeviceData()
  } catch (error) {
    console.error(error)
  }
}

const getDeviceData = async (device = 'hank_1') => {
  const { data } = await database.get('device-data', { params: { device } })
  ctx.dispatch({ type: 'data', data })
}

export const createActions = (state, dispatch) => {
  ctx.state = state
  ctx.dispatch = dispatch
  return {
    initialize,
  }
}
