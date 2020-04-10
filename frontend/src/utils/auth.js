import auth0 from 'auth0-js'
import { navigate } from '@reach/router'

const isBrowser = typeof window !== 'undefined'

const appRoot = '/admin/charts'

const auth = isBrowser
  ? new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectUri:
        window.location.origin + process.env.REACT_APP_AUTH0_CALLBACK,
      responseType: 'token id_token',
      scope: 'openid profile email',
    })
  : null

export const login = () => {
  if (!isBrowser) return
  auth.authorize()
}

export const logout = () => {
  if (!isBrowser) return

  endSession()
}

export const checkAuth = () => {
  if (!isBrowser) return
  if (process.env.NODE_ENV === 'development') return true

  const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
  const now = new Date().getTime()

  if (now < expiresAt) return true
}

const setSession = authResult => {
  const expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime()
  )

  localStorage.setItem('access_token', authResult.accessToken)
  localStorage.setItem('id_token', authResult.idToken)
  localStorage.setItem('expires_at', expiresAt)
}

const endSession = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('id_token')
  localStorage.removeItem('expires_at')
}

export const handleAuthentication = () => {
  if (!isBrowser) return

  auth.parseHash((err, authResult) => {
    if (err) console.error(err)
    else if (authResult && authResult.accessToken && authResult.idToken) {
      setSession(authResult)
      navigate(appRoot)
    }
  })
}
