import React from 'react'
import Chart from '../chart/chart'
import { oneHourAgo } from '../datetime'
import Settings from './settings'

export default ({ state: [status, result], useGetData, getData, ...props }) => {
  const liveModeSet = () => {
    return getData({ start: oneHourAgo() }, true).catch(console.error)
  }

  const liveModeAction = ({ type, data, setLiveData }) => {
    if (type !== 'standard') return
    setLiveData((liveData) => [...liveData.slice(1), data])
  }

  return (
    <>
      <Chart
        {...{ ...props, ...result, status, liveModeAction, liveModeSet }}
        yDomain={[-1, 100]}
      >
        <Settings {...{ useGetData }} />
      </Chart>
    </>
  )
}
