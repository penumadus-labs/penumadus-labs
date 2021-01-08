import { navigate } from '@reach/router'
import { useEffect, useState } from 'react'
import useApi from '../api'

const goHome = () => navigate('/')

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
          goHome()
        })
    },
    // eslint-disable-next-line
    []
  )

  const authenticate = async () => {
    await initializeApi()
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
    await goHome()
  }

  return [authState, { handleLogin, loginStatus, handleLogout }]
}

export default useAuth
