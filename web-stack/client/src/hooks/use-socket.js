import React from 'react'
import { useState, useEffect } from 'react'
import useDevices from '../context/devices/context'
import { wsURL } from '../utils/url'

const initialStatus = {
  data: 'not recieved',
  acceleration: 'not recieved',
}

let ws

const useSocket = () => {
  const [status, setStatus] = useState(initialStatus)
  const { data, acceleration } = status
  // eslint-disable-next-line
  const [{ settings }, { getSettings }] = useDevices()
  // const [, { getStandardData }] = useDatabase()

  useEffect(() => {
    ws = new WebSocket(wsURL)
    return () => {
      ws.close()
    }
  }, [])

  useEffect(() => {
    ws.onmessage = async (raw) => {
      if (!settings) {
        getSettings().catch(console.error)
      }

      const { type } = JSON.parse(raw.data)
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
      } catch (error) {
        console.error(error)
      }
    }
    // eslint-disable-next-line
  }, [settings])

  return (
    <div>
      <p>Last data packet: {data}</p>
      <p>Last acceleration packet: {acceleration}</p>
    </div>
  )
}

export default useSocket
