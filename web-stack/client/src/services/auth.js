import { useState, useEffect } from 'react'
import { navigate } from '@reach/router'
import { initializeSocket } from './socket'
import useApi, { api } from '../context/api'

const useAuth = () => {
  const [, { initializeApi }] = useApi()

  const [authState, setAuthState] = useState({ verifying: true })

  const authenticate = async (token) => {
    initializeSocket(token)
    await initializeApi(token)
    setAuthState({ loggedIn: true })
  }

  useEffect(
    () => {
      const token = sessionStorage.getItem('token')
      if (!token) return setAuthState({})
      api
        .post('auth/verify', {}, { headers: { token } })
        .then(() => authenticate(token))
        .catch((error) => {
          setAuthState({})
          console.error(error)
        })
    },
    // eslint-disable-next-line
    []
  )

  const login = async (username, password) => {
    try {
      const {
        data: { token },
      } = await api.post('auth/login', { username, password })
      sessionStorage.setItem('token', token)
      await authenticate(token)
      await navigate('charts')
    } catch (error) {
      console.error(error)
    }
  }

  const logout = async () => {
    sessionStorage.removeItem('token')
    setAuthState({})
    await navigate('')
  }

  return [authState, { login, logout }]
}

export default useAuth
