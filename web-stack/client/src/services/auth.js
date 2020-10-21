import { navigate } from '@reach/router'
import { useEffect, useState } from 'react'
import useApi, { api } from '../api/api'
// import createRequestHook from '../api/create-request-hook'
import { useSocket } from './socket'

// const login = (username, password) =>
//   api.post('auth/login', { username, password }, { timeout: 3000 })

// const [useLogin] = createRequestHook(login)

const useAuth = () => {
  const [{ id }, { initializeApi, setId }, { useLogin }] = useApi()
  const [loginStatus, loginRequest] = useLogin()

  const [authState, setAuthState] = useState({ verifying: true })

  useSocket(id)

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

  const authenticate = async () => {
    await initializeApi()
    if (window.location.pathname === '/') navigate('charts/standard')
    setAuthState({ loggedIn: true })
  }

  const login = (username, password) => {
    loginRequest(username, password).then(authenticate)
  }

  const logout = async () => {
    await api.post('auth/logout')
    setAuthState({})
    setId(null)
    await navigate('')
  }

  return [authState, { login, loginStatus, logout }]
}

export default useAuth
