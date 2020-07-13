import url from '../../utils/url'
import { create } from 'axios'

let database

const ctx = {}

const initialize = async (token, id = 'unit_3') => {
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
  try {
    const standardStore = sessionStorage.getItem('standard-data')
    const standard = standardStore
      ? JSON.parse(standardStore)
      : await getStandardData(id)
    ctx.dispatch({ type: 'standard-data', standard })
  } catch (error) {
    console.error(error)
  }
}

// const getDeviceData = async (id) => {
//   try {
//     const { data } = await database.get('device-data', { params: { id } })
//     sessionStorage.setItem('data', JSON.stringify(data))
//     return data
//   } catch (error) {
//     console.error(error)
//   }
// }

const getStandardData = async ({ id, start, end }) => {
  try {
    const { data } = await database.get('device-standard-data', {
      params: { id, start, end },
    })
    sessionStorage.setItem('standard-data', JSON.stringify(data))
    return data
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
