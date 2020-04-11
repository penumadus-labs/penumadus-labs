import React, { createContext, useEffect } from 'react'
import useAsyncReducer from '../../hooks/use-async-reducer'
import { reducer, initialState, createActions } from './reducer'

const DatabaseContext = createContext()

export const DatabaseContextProvider = ({ children }) => {
  const [state, actions] = useAsyncReducer(reducer, initialState, createActions)

  useEffect(() => {
    actions.getDevices()
  }, [actions])

  return (
    <DatabaseContext.Provider value={[state, actions]}>
      {children}
    </DatabaseContext.Provider>
  )
}

export default DatabaseContext
