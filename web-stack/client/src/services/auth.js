import { navigate } from '@reach/router'
import { useEffect, useState } from 'react'
import useApi, { api } from '../context/api'
import createRequestHook from '../context/create-request-hook'
import { initializeSocket } from './socket'

const [useLogin] = createRequestHook((username, password) =>
  api.post('auth/login', { username, password })
)

const useAuth = () => {
  const [, { initializeApi, setId }] = useApi()
  const [loginStatus, loginRequest] = useLogin()

  const [authState, setAuthState] = useState({ verifying: true })

  const authenticate = async () => {
    await initializeApi()
    initializeSocket()
    navigate('charts')
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
    loginRequest(username, password).then(authenticate).catch(console.error)

  const logout = async () => {
    await api.post('auth/logout')
    setAuthState({})
    setId()
    await navigate('')
  }

  return [authState, { login, loginStatus, logout }]
}

export default useAuth
