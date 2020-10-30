import { navigate } from '@reach/router'
import { useEffect, useState } from 'react'
import useApi from '../api'

const useAuth = () => {
  const [, { initializeApi, verify, logout }, { useLogin }] = useApi()
  const [loginStatus, login] = useLogin()

  const [authState, setAuthState] = useState({ verifying: true })

  useEffect(
    () => {
      verify()
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
    if (window.location.pathname === '/') navigate('standard')
    setAuthState({ loggedIn: true })
  }

  const handleLogin = (username, password) => {
    login(username, password).then(authenticate).catch(console.error)
  }

  const handleLogout = async () => {
    await logout()
    setAuthState({})
    await navigate('')
  }

  return [authState, { handleLogin, loginStatus, handleLogout }]
}

export default useAuth
