import { create } from 'axios'
import { navigate } from '@reach/router'
import url from '../../utils/url'

const auth = create({
  baseURL: url + 'api/auth/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json; text/plain',
  },
})

const ctx = {}

const login = async ({ username, password }) => {
  try {
    const {
      data: { token },
    } = await auth.post('login', {
      username,
      password,
    })
    sessionStorage.setItem('token', token)
    ctx.dispatch({ type: 'authorized', token })
    await navigate('/charts')
  } catch (error) {
    ctx.dispatch({ type: 'unauthorized' })
    throw error.response ? error.response.statusText : error.toString()
  }
}

const initialize = async (token) => {
  if (!token) return ctx.dispatch({ type: 'unauthorized' })
  try {
    await auth.get('verify', { headers: { token } })
    ctx.dispatch({ type: 'authorized', token })
  } catch (error) {
    console.error(error)
    ctx.dispatch({ type: 'unauthorized' })
  }
}

const logout = () => {
  sessionStorage.removeItem('token')
  ctx.dispatch({ type: 'unauthorized' })
}

export const createActions = (state, dispatch) => {
  ctx.state = state
  ctx.dispatch = dispatch
  return {
    initialize,
    login,
    logout,
  }
}
