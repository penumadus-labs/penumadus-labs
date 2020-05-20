import React, { createContext, useEffect } from 'react'
import useReducerWithActions from '../../hooks/use-reducer-with-actions'
import { reducer, initialState, createActions } from './reducer'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [state, { initialize, ...actions }] = useReducerWithActions(
    reducer,
    initialState,
    createActions
  )

  useEffect(() => {
    void (async () => {
      await initialize(sessionStorage.getItem('token'))
    })().catch(console.error)
  }, [initialize])

  return (
    <AuthContext.Provider value={[state, actions]}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
