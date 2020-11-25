import React from 'react'
import Chart from '../chart/chart'
import DomainSelector from './domain-selector'
import { resolution } from '../../../utils/live-data-config'

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
    return getData({ recent: true }, true)
  }

  const handleLive = ({ type, data, setLiveData }) => {
    if (type !== dataType) return
    setLiveData((liveData) => [
      // ...liveData.slice(+(data.time - liveData[0].time >= oneHourInSeconds)),
      ...liveData.slice(+(liveData.length >= resolution)),
      data,
    ])
  }

  return (
    <>
      <Chart
        {...{ initializeLive, handleLive }}
        data={data}
        getData={getData}
        useDownload={useDownloadData}
        useDelete={useDeleteData}
        yDomain={yDomain}
        render={(live) => live || <DomainSelector useGetData={useGetData} />}
      ></Chart>
    </>
  )
}
