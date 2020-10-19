import { useState, useEffect } from 'react'
import useMessage from '../../../../services/socket'

export default ({ apiData, liveModeSet, liveModeAction }) => {
  const [live, setLive] = useState(true)
  const [liveData, setLiveData] = useState(apiData)

  const toggleLive = async () => {
    if (live) {
      setLive(false)
    } else {
      const { data } = await liveModeSet()
      setLiveData(data)
      setLive(true)
    }
  }

  useEffect(() => {
    if (live) liveModeSet()
    // eslint-disable-next-line
  }, [])

  useMessage(
    (ctx) => {
      if (live) {
        liveModeAction({ setLiveData, ...ctx })
      }
    },
    [live]
  )

  const data = live ? liveData : apiData

  return [data, { live, toggleLive }]
}
