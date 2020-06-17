import React from 'react'
import { useState, useEffect } from 'react'
import useDevices from '../context/devices/context'
import { wsURL } from '../utils/url'

const initialStatus = {
  data: 'not recieved',
  acceleration: 'not recieved',
}

const useSocket = () => {
  const [{ data, acceleration }, setStatus] = useState(initialStatus)
  const [{ settings }, { getSettings }] = useDevices()
  useEffect(() => {
    const ws = new WebSocket(wsURL)

    ws.onmessage = async ({ message: { type, data } }) => {
      if (!settings) await getSettings()
      const date = Date.now()
      try {
        switch (type) {
          case 'standard':
            setStatus(
              (status) =>
                (status.data = `${date.getHours()}:${
                  date.getMinutes
                }:${date.getSeconds()}`)
            )
            break
          case 'acceleration':
            setStatus(
              (status) =>
                (status.acceleration = `${date.getHours()}:${
                  date.getMinutes
                }:${date.getSeconds()}`)
            )
            break
          default:
            throw new Error('socket sent invalid action type')
        }
        setStatus(await data.text())
      } catch (error) {}
    }
  })
  return (
    <div>
      <p>Last data packet: {data}</p>
      <p>Last acceleration packet: {acceleration}</p>
    </div>
  )
}

export default useSocket
