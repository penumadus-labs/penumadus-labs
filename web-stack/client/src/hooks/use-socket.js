import React from 'react'
import { useState, useEffect } from 'react'
import useDevices from '../context/devices/context'
import { wsURL } from '../utils/url'

const initialStatus = {
  data: 'not recieved',
  acceleration: 'not recieved',
}

const useSocket = () => {
  const [status, setStatus] = useState(initialStatus)
  const { data, acceleration } = status
  // eslint-disable-next-line
  const [{ settings }, { getSettings }] = useDevices()

  useEffect(() => {
    const ws = new WebSocket(wsURL)

    ws.onmessage = async (raw) => {
      const { type, data } = JSON.parse(raw.data)
      // if (!settings) await getSettings()
      const date = new Date(Date.now())
      try {
        switch (type) {
          case 'standard':
            setStatus((status) => {
              status.data = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
              return { ...status }
            })
            break
          case 'acceleration':
            setStatus((status) => {
              status.acceleration = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
              return { ...status }
            })
            break
          default:
            throw new Error('socket sent invalid action type')
        }
        setStatus(await data.text())
      } catch (error) {
        console.error(error)
      }
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
