import React, { createContext, useEffect } from 'react'
import useAsyncReducer from '../hooks/use-async-reducer'
import reducer, { initialState, createActions } from './reducer'

const DevicesContext = createContext()

export const Provider = ({ children }) => {
  const [state, actions] = useAsyncReducer(reducer, initialState, createActions)

  useEffect(() => {
    actions.getDevices()
  }, [actions])

  return (
    <DevicesContext.Provider value={[state, actions]}>
      {children}
    </DevicesContext.Provider>
  )
}

export default DevicesContext
