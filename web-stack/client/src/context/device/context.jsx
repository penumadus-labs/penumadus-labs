import React, { createContext, useEffect } from 'react'
import useAsyncReducer from '../../hooks/use-reducer-with-actions'
import { reducer, initialState, createActions } from './reducer'

const DeviceContext = createContext()

export default ({ children }) => {
  const [state, actions] = useAsyncReducer(reducer, initialState, createActions)

  useEffect(() => {
    actions.open()

    return actions.close
  }, [actions])

  return (
    <DeviceContext.Provider value={[state, actions]}>
      {children}
    </DeviceContext.Provider>
  )
}
