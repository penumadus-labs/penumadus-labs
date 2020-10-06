import { navigate } from '@reach/router'
import { useEffect, useState } from 'react'
import useApi, { api } from '../context/api'
// import createRequestHook from '../context/create-request-hook'
import { initializeSocket } from './socket'

// const login = (username, password) =>
//   api.post('auth/login', { username, password }, { timeout: 3000 })

// const [useLogin] = createRequestHook(login)

const useAuth = () => {
  const [, { initializeApi, setId }, { useLogin }] = useApi()
  const [loginStatus, loginRequest] = useLogin()

  const [authState, setAuthState] = useState({ verifying: true })

  const authenticate = async () => {
    await initializeApi()
    initializeSocket()
    if (window.location.pathname === '/') navigate('charts/standard')
    setAuthState({ loggedIn: true })
  }

  useEffect(
    () => {
      api
        .post('auth/verify')
        .then(authenticate)
        .catch((error) => {
          setAuthState({})
        })
    },
    // eslint-disable-next-line
    []
  )

  const login = (username, password) => {
    loginRequest(username, password).then(authenticate)
  }

  const logout = async () => {
    await api.post('auth/logout')
    setAuthState({})
    setId()
    await navigate('')
  }

  return [authState, { login, loginStatus, logout }]
}

export default useAuth
