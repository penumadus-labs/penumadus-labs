import { useState, useEffect } from 'react'
import useMessage from '../../../../services/socket'

export default (apiData, initialize, handleEvent) => {
  const [live, setLive] = useState(false)
  const [liveData, setLiveData] = useState(apiData)

  const toggleLive = async () => {
    if (!live) {
      const { data } = await initialize()
      setLiveData(data)
    }
    setLive(!live)
  }

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

  const data = live ? liveData : apiData

  return [data, { live, toggleLive }]
}
