import React, { createContext, useEffect } from 'react'
import useAsyncReducer from '../../hooks/use-reducer-with-actions'
import { reducer, initialState, createActions } from './reducer'
// import io from 'socket.io-client'
import { wsURL } from '../../utils/url'

const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
  const [state, actions] = useAsyncReducer(reducer, initialState, createActions)

  useEffect(() => {
    const socket = new WebSocket(wsURL)

    // socket.onopen = () => console.log('connected to socket')
    

    socket.onmessage = ({ data }) => {
      actions.recieved(data)
    }

    socket.onerror = error => {
      console.log(error)
      actions.error(error)
    }

    return () => {
      socket.close()
    }
  }, [actions])

  return (
    <SocketContext.Provider value={[state, actions]}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContext
