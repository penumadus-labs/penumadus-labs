// global state not in use

import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

const DeviceContext = createContext()

export const Provider = ({ children }) => {
  const [device, setDevice] = useState('')
  const [deviceSettings, setDeviceSettings] = useState({})

  useEffect(() => {
    void (async () => {
      const deviceList = ['device1', 'device2', 'device3']
      const resps = await Promise.all(
        deviceList.map(device => axios.get(`/${device}.csv`))
      )
      const result = deviceList.reduce((acc, device, index) => {
        acc[device] = resps[index]
        return acc
      }, {})
      setDeviceSettings(result)
      setDevice(deviceList[0])
    })().catch(console.error)
  })

  const value = {
    device,
    setDevice,
    deviceList: Object.keys(deviceSettings),
    settings: deviceSettings[device],
  }

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  )
}

export default DeviceContext
