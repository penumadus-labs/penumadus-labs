import React from 'react'
import Chart from '../chart/chart'
import { oneHourAgo, oneHourInSeconds } from '../utils/datetime'
import DomainSelector from './domain-selector'

export default ({
  dataType,
  data,
  getData,
  useGetData,
  useDownloadData,
  useDeleteData,
  yDomain = [-1, 100],
}) => {
  const initializeLive = () => {
    return getData({ start: oneHourAgo(), end: Date.now() / 1000 }, true).catch(
      console.error
    )
  }

  const handleLive = ({ type, data, setLiveData }) => {
    if (type !== dataType) return
    setLiveData((liveData) => [
      ...liveData.slice(+(data.time - liveData[0].time >= oneHourInSeconds)),
      data,
    ])
  }

  return (
    <>
      <Chart
        {...{ initializeLive, handleLive }}
        data={data}
        useDownload={useDownloadData}
        useDelete={useDeleteData}
        yDomain={yDomain}
        render={(live) => live || <DomainSelector useGetData={useGetData} />}
      ></Chart>
    </>
  )
}
