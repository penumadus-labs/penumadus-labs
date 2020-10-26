import { navigate } from '@reach/router'
import { useEffect, useState } from 'react'
import useApi, { api } from '../api'

const useAuth = () => {
  const [, { initializeApi, setId }, { useLogin }] = useApi()
  const [loginStatus, loginRequest] = useLogin()

  const [authState, setAuthState] = useState({ verifying: true })

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
