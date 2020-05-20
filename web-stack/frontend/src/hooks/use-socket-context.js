import { useContext } from 'react'
import SocketContext from '../context/socket/socket'

export const useSocketContextState = () => useContext(SocketContext)[0]
export const useSocketContextActions = () => useContext(SocketContext)[1]

export default () => useContext(SocketContext)
