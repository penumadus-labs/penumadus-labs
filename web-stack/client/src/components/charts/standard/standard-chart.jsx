import React from 'react'
import Chart from '../chart/chart'
import { oneHourAgo } from '../datetime'
import Settings from './settings'

export default ({
  state: [status, payload],
  getData,
  useGetData,
  ...props
}) => {
  const initializeLive = () => {
    return getData({ start: oneHourAgo(), end: Date.now() / 1000 }, true).catch(
      console.error
    )
  }

  const handleLive = ({ type, data, setLiveData }) => {
    if (type !== 'standard') return
    setLiveData((liveData) => [...liveData.slice(1), data])
  }

  return (
    <>
      <Chart
        {...{
          ...props,
          ...payload,
          initializeLive,
          handleLive,
          status,
        }}
        yDomain={[-1, 100]}
      >
        <Settings {...{ useGetData }} />
      </Chart>
    </>
  )
}
