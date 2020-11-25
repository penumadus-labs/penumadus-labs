import { navigate } from '@reach/router'
import { useEffect, useState } from 'react'
import useApi from '../api'

const useAuth = () => {
  const [
    ,
    { initializeApi, verify, logout, setDevice },
    { useLogin },
  ] = useApi()
  const [loginStatus, login] = useLogin()

  const [authState, setAuthState] = useState({ verifying: true })

  useEffect(
    () => {
      verify()
        .then(authenticate)
        .catch((error) => {
          setAuthState({})
          navigate('/')
        })
    },
    // eslint-disable-next-line
    []
  )

  const authenticate = async () => {
    await initializeApi()
    // if (window.location.pathname === '/') navigate('environment')
    setAuthState({ loggedIn: true })
  }

  const handleLogin = (username, password) => {
    login(username, password).then(authenticate).catch(console.error)
  }

  const handleLogout = async () => {
    await logout()
    setAuthState({})
    setDevice(null)
    localStorage.clear()
    await navigate('/')
  }

  return [authState, { handleLogin, loginStatus, handleLogout }]
}

export default useAuth
