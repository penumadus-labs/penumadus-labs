import React, { useState } from 'react'
import ChartBody from './chart-body'

import useApi from '../../../api'
import useMessage from '../../../services/socket'

export default ({
  children,
  dataLabel,
  data: [status, { noDataCollected, data } = {}],
  initializeLive,
  handleMutation,
  ...props
}) => {
  if (status) return status

  const [, { mutateStore }] = useApi()

  const [live, setLive] = useState(localStorage.getItem('live') === 'true')
  const toggleLive = async () => {
    if (!live) await initializeLive()
    localStorage.setItem('live', !live)
    setLive(!live)
  }

  useMessage(({ type, data: messageData }) => {
    if (live && type !== dataLabel) return
    mutateStore(dataLabel, (store) => {
      const [status, { data }] = store
      return [status, { data: handleMutation(messageData, data) }]
    })
  })

  if (noDataCollected)
    return (
      <div className="card">
        <p>no data has been collected for this unit</p>
      </div>
    )

  return <ChartBody {...props} {...{ live, toggleLive, data }} />
}
