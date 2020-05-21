import React, { createContext, useEffect } from 'react'
import useAsyncReducer from '../../hooks/use-reducer-with-actions'
import { reducer, initialState, createActions } from './reducer'
import { useAuthState } from '../../hooks/use-auth'

const DatabaseContext = createContext()

export const DatabaseProvider = ({ children }) => {
  const [
    { initialized, ...state },
    { initialize, getDeviceData, ...actions },
  ] = useAsyncReducer(reducer, initialState, createActions)

  const { token } = useAuthState()

  useEffect(() => {
    if (token) {
      if (!initialized) initialize(token)
      else getDeviceData()
    }
    // eslint-disable-next-line
  }, [token])

  return (
    <DatabaseContext.Provider value={[state, actions]}>
      {children}
    </DatabaseContext.Provider>
  )
}

export default DatabaseContext
