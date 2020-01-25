import React, { createContext, useReducer, useEffect, useMemo } from 'react'
import reducer, { initialState, createActions } from './reducer'

const DevicesContext = createContext()

export const Provider = ({ children }) => {
  console.log('context')
  const [state, disptach] = useReducer(reducer, initialState)

  const actions = useMemo(() => {
    return createActions(disptach)
  }, [disptach])

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
