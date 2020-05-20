import React, { createContext, useEffect } from 'react'
import useAsyncReducer from '../../hooks/use-reducer-with-actions'
import { reducer, initialState, createActions } from './reducer'

const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
  const [state, actions] = useAsyncReducer(reducer, initialState, createActions)

  useEffect(() => {
    actions.open()

    return actions.close
  }, [actions])

  return (
    <SocketContext.Provider value={[state, actions]}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContext
