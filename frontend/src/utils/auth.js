import auth0 from 'auth0-js'
import { navigate } from 'gatsby'

const isBrowser = typeof window !== 'undefined'

const loginRoot = '/'
const appRoot = '/app/charts'

const auth = isBrowser
  ? new auth0.WebAuth({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENTID,
      redirectUri: process.env.AUTH0_CALLBACK,
      responseType: 'token id_token',
      scope: 'openid profile email',
    })
  : {}

export const login = () => {
  if (isBrowser) auth.authorize()
}

export const logout = () => {
  if (!isBrowser) return

  endSession()
  navigate(loginRoot)
}

export const checkAuth = () => {
  if (!isBrowser) return

  const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
  const now = new Date().getTime()

  if (now < expiresAt) return true

  navigate(loginRoot)
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
    if (err) {
      console.error(err)
      navigate(loginRoot)
    } else if (authResult && authResult.accessToken && authResult.idToken) {
      setSession(authResult)
      navigate(appRoot)
    }
  })
}
