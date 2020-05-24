import React, { createContext, useEffect, useContext } from 'react'
import useAsyncReducer from '../../hooks/use-reducer-with-actions'
import { reducer, initialState, createActions } from './reducer'
import useAuth from '../../context/auth/context'

const DevicesContext = createContext()

export const DevicesProvider = ({ children }) => {
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
    <DevicesContext.Provider value={[state, actions]}>
      {children}
    </DevicesContext.Provider>
  )
}

export default () => useContext(DevicesContext)
