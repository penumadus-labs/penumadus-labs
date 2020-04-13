import React, { createContext, useEffect } from 'react'
import useAsyncReducer from '../../hooks/use-async-reducer'
import { reducer, initialState, createActions } from './reducer'
// import io from 'socket.io-client'
import { wsURL } from '../../utils/url'

const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
  const [state, actions] = useAsyncReducer(reducer, initialState, createActions)

  useEffect(() => {
    const socket = new WebSocket(wsURL)

    socket.onopen = () => {
      console.log('connected to socket')
    }

    socket.onmessage = ({ data }) => {
      console.log('recieved data from socket')

      actions.recieved(data)
      socket.send('hello')
    }

    socket.onerror = error => {
      actions.error(error.toString())
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
