import { generate } from 'randomstring'
import { navigate } from 'gatsby'

const isBrowser = typeof window !== 'undefined'

const auth = {
  username: 'user',
  password: 'pass',
  key: generate(),
}

export const checkAuth = () => {
  if (isBrowser) {
    if (localStorage.getItem('auth-key') === auth.key) return true
    navigate('/')
  }
  return false
}

export const handleLogin = ({ username, password }) => {
  if (username === auth.username && password === auth.password) {
    localStorage.setItem('auth-key', auth.key)
    navigate('/app/graphs')
  }
}

export const logout = () => {
  localStorage.setItem('auth-key', null)
  navigate('/')
}
