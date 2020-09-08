import { navigate } from '@reach/router'
import { useEffect, useState } from 'react'
import useApi, { api } from '../context/api'
import { initializeSocket } from './socket'

const useAuth = () => {
  const [, { initializeApi, setId }] = useApi()

  const [authState, setAuthState] = useState({ verifying: true })

  const authenticate = async () => {
    await initializeApi()
    initializeSocket()
    setAuthState({ loggedIn: true })
  }

  useEffect(
    () => {
      api
        .post('auth/verify', {}, { timeout: 500 })
        .then(authenticate)
        .catch((error) => {
          setAuthState({})
          console.error(error)
        })
    },
    // eslint-disable-next-line
    []
  )

  const login = (username, password) =>
    api
      .post('auth/login', { username, password })
      .then(() => {
        navigate('charts')
        return authenticate()
      })
      .catch(console.error)

  const logout = async () => {
    await api.post('auth/logout')
    setAuthState({})
    setId()
    await navigate('')
  }

  return [authState, { login, logout }]
}

export default useAuth
