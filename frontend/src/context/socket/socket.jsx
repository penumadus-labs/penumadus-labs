import React, { createContext, useEffect } from 'react'
import useAsyncReducer from '../../hooks/use-async-reducer'
import { reducer, initialState, createActions } from './reducer'
import io from 'socket.io-client'
import url from '../../utils/url'

const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
  const [state, actions] = useAsyncReducer(reducer, initialState, createActions)

  useEffect(() => {
    const socket = io(url)

    socket.on('connect', () => {
      console.log('connected to socket')
    })

    socket.on('data', data => {
      console.log('recieved data')
      actions.recieved(data)
    })

    socket.on('connect_error', e => {
      actions.error('could not connect to socket')
    })

    socket.on('error', error => {
      actions.error(error.toString())
    })

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
