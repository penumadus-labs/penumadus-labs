import useStateEffect from './use-state-effect'
import { checkAuth } from '../utils/auth'

const useAuth = () => {
  const authenticated = useStateEffect(false, setAuth => {
    const result = checkAuth()
    if (result) setAuth(result)
  })
  return authenticated
}

export default useAuth
