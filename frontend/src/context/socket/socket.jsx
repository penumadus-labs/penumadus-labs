import React, { createContext } from 'react'
import useAsyncReducer from '../../hooks/use-async-reducer'
import { reducer, initialState, createActions } from './reducer'

const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
  const [state, actions] = useAsyncReducer(reducer, initialState, createActions)

  return (
    <SocketContext.Provider value={[state, actions]}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContext
