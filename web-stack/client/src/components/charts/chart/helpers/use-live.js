import { useState } from 'react'
import useMessage from '../../../../services/socket'

export default ({ apiData, liveModeSet, liveModeAction }) => {
  const [live, setLive] = useState(false)
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
