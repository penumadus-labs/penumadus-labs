import React, { useState } from 'react'
import ChartBody from './chart-body'

import useApi from '../../../api'
import useMessage from '../../../services/socket'

export default ({
  children,
  dataType,
  data: [status, { noDataCollected, data } = {}],
  initializeLive,
  handleMutation,
  ...props
}) => {
  if (status) return status

  const [, { mutateStore }] = useApi()

  const [live, setLive] = useState(
    localStorage.getItem('live') || noDataCollected
  )
  const toggleLive = async () => {
    if (!live) {
      if (initializeLive) await initializeLive()
      localStorage.setItem('live', 'live')
    } else localStorage.removeItem('live')
    setLive(!live)
  }

  useMessage(
    ({ type, data: messageData }) => {
      if (!live || type !== dataType) return
      mutateStore(dataType, (store) => {
        const [status, { data }] = store
        return [status, { data: handleMutation(messageData, data) }]
      })
    },
    [live]
  )

  if (noDataCollected)
    return (
      <div className="card">
        <p>no data has been collected for this unit</p>
      </div>
    )

  return <ChartBody {...props} {...{ live, toggleLive, data }} />
}
