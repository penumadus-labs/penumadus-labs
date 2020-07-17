// import React, { createContext, useContext, useEffect } from 'react'
import { useEffect } from 'react'
import initialize, { useMessage } from './actions'
import useDevices from '../devices/context'

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
  // const [{ token }] = useAuth()
  const [{ settings }, { getSettings }] = useDevices()

  useEffect(() => {
    initialize()
  }, [])

  useMessage(() => {
    if (!settings) getSettings().catch(console.error)
  }, [settings])

  return null
}

export default useMessage
