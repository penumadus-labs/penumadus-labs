import { useState, useEffect } from 'react'
import useMessage from '../../../../services/socket'

export default (collectedData, initialize, handleEvent) => {
  const [live, setLive] = useState(!localStorage.getItem('live'))
  const [liveData, setLiveData] = useState(collectedData)

  const toggleLive = async () => {
    if (!live) {
      const { data } = await initialize()
      setLiveData(data)
    }
    if (live) localStorage.setItem('live', 'live')
    else localStorage.removeItem('live')
    setLive(!live)
  }

  useEffect(() => {
    if (live) setLiveData(collectedData)
  }, [live, collectedData])

  useEffect(() => {
    if (live) initialize()
    // eslint-disable-next-line
  }, [])

  useMessage(
    (ctx) => {
      if (live) handleEvent({ setLiveData, ...ctx })
    },
    [live]
  )

  const data = live ? liveData : collectedData

  return [data, { live, toggleLive }]
}
