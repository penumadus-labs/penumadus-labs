import React from 'react'
import Chart from '../chart/chart'
import { oneHourAgo, oneHourInSeconds } from '../datetime'
import DomainSelector from './DomainSelector'

export default ({
  state: [status, payload],
  getData,
  useGetStandardData,
  ...props
}) => {
  const initializeLive = () => {
    return getData({ start: oneHourAgo(), end: Date.now() / 1000 }, true).catch(
      console.error
    )
  }

  const handleLive = ({ type, data, setLiveData }) => {
    if (type !== 'standard') return
    setLiveData((liveData) => [
      ...liveData.slice(+(data.time - liveData[0].time >= oneHourInSeconds)),
      data,
    ])
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
        render={(live) =>
          live ? null : <DomainSelector useGetData={useGetStandardData} />
        }
      ></Chart>
    </>
  )
}
