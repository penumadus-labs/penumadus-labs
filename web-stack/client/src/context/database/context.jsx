import React, { createContext, useEffect } from 'react'
import useAsyncReducer from '../../hooks/use-reducer-with-actions'
import { reducer, initialState, createActions } from './reducer'
import { useAuthState } from '../../hooks/use-auth'

const DatabaseContext = createContext()

export const DatabaseProvider = ({ children }) => {
  const [state, { initialize, ...actions }] = useAsyncReducer(
    reducer,
    initialState,
    createActions
  )

  const { token } = useAuthState()

  useEffect(
    () => initialize(token),
    // eslint-disable-next-line
    [token]
  )

  return (
    <DatabaseContext.Provider value={[state, actions]}>
      {children}
    </DatabaseContext.Provider>
  )
}

export default DatabaseContext
