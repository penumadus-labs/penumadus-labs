import { useContext } from 'react'
import DeviceContext from '../context/device/context'

export const useDeviceState = () => useContext(DeviceContext)[0]
export const useDeviceActions = () => useContext(DeviceContext)[1]

export default () => useContext(DeviceContext)
