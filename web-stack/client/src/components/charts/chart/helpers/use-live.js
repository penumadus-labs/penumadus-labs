import { useState, useEffect } from 'react'
import useMessage from '../../../../services/socket'

export default (apiData, initialize, hanleEvent) => {
  const [live, setLive] = useState(false)
  const [liveData, setLiveData] = useState(apiData)

  const toggleLive = async () => {
    if (live) {
      setLive(false)
    } else {
      const { data } = await initialize()
      setLiveData(data)
      setLive(true)
    }
  }

  useEffect(() => {
    if (live) initialize()
    // eslint-disable-next-line
  }, [])

  useMessage(
    (ctx) => {
      if (live) hanleEvent({ setLiveData, ...ctx })
    },
    [live]
  )

  const data = live ? liveData : apiData

  return { data, live, toggleLive }
}
