import useAsync from './use-async'
import { checkAuth } from '../utils/auth'

const useAuth = () => {
  const authenticated = useAsync(false, async setAuth => {
    const result = await checkAuth()
    if (result) setAuth(result)
  })
  return authenticated
}

export default useAuth
