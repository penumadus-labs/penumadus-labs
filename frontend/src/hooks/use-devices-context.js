import { useContext } from 'react'
import DevicesContext from '../context/Devices.jsx'

export const useDevicesState = () => useContext(DevicesContext)[0]

export default () => useContext(DevicesContext)
