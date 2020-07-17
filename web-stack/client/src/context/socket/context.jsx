// import React, { createContext, useContext, useEffect } from 'react'
import { useEffect } from 'react'
import initialize, { useMessage } from './actions'
// import useAuth from '../../context/auth/context'

// const SocketContext = createContext()

// export const SocketProvider = ({ children }) => {
//   // const [{ token }] = useAuth()

//   useEffect(() => {
//     initialize()
//   }, [])

//   return (
//     <SocketContext.Provider value={useMessage}>{children}</SocketContext.Provider>
//   )
// }

// export default () => useContext(SocketContext)

export const SocketProvider = () => {
  useEffect(() => {
    initialize()
  }, [])

  return null
}

export default useMessage
