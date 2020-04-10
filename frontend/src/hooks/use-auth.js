import useAsync from './use-state-effect'
import { checkAuth } from '../utils/auth'

const useAuth = () => {
  const authenticated = useAsync(false, setAuth => {
    const result = checkAuth()
    if (result) setAuth(result)
  })
  return authenticated
}

export default useAuth
