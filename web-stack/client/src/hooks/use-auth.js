import { useContext } from 'react'
import AuthContext from '../context/auth/context'

export const useAuthState = () => useContext(AuthContext)[0]
export const useAuthActions = () => useContext(AuthContext)[1]

export default () => useContext(AuthContext)
