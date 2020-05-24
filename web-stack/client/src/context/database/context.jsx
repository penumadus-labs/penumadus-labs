import React, { createContext, useEffect, useContext } from 'react'
import useAsyncReducer from '../../hooks/use-reducer-with-actions'
import { reducer, initialState, createActions } from './reducer'
import useAuth from '../../context/auth/context'

const DatabaseContext = createContext()

export const DatabaseProvider = ({ children }) => {
  const [state, { initialize, ...actions }] = useAsyncReducer(
    reducer,
    initialState,
    createActions
  )

  const [{ token }] = useAuth()

  useEffect(
    () => {
      initialize(token)
    },
    // eslint-disable-next-line
    [token]
  )

  return (
    <DatabaseContext.Provider value={[state, actions]}>
      {children}
    </DatabaseContext.Provider>
  )
}

export default () => useContext(DatabaseContext)
