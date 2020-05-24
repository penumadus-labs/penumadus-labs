import React, { createContext, useEffect, useContext } from 'react'
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
    if (state.loading) initialize(sessionStorage.getItem('token'))
  }, [state.loading, initialize])

  return (
    <AuthContext.Provider value={[state, actions]}>
      {children}
    </AuthContext.Provider>
  )
}

export default () => useContext(AuthContext)
