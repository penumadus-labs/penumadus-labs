import React from 'react'
import Chart from '../chart/chart'
import { oneDayAgo } from '../datetime'
import Settings from './settings'

export default ({ state: [status, result], useGetData, getData, ...props }) => {
  if (status) return <div className="card">{status}</div>
  if (!result) return null

  const liveModeSet = () => {
    return getData({ start: oneDayAgo() }, true).catch(console.error)
  }

  const liveModeAction = ({ type, data, setLiveData }) => {
    if (type !== 'standard') return
    setLiveData((liveData) => [...liveData.slice(1), data])
  }

  return (
    <>
      <Chart
        {...{ ...props, ...result, liveModeAction, liveModeSet }}
        yDomain={[-1, 100]}
      >
        <Settings {...{ useGetData }} />
      </Chart>
    </>
  )
}
