import React from 'react'
import useApi from '../../../api'
import Chart from '../chart/chart'
import { oneHourAgo, oneHourInSeconds } from '../datetime'
import DomainSelector from './domain-selector'

export default () =>
  //   {
  //   state: [status, payload],
  //   getData,
  //   useGetStandardData,
  //   ...props
  // }
  {
    const [
      { standardData },
      { getStandardData },
      { useGetStandardData, useDownloadStandardData, useDeleteStandardData },
    ] = useApi()

    const initializeLive = () => {
      return getStandardData(
        { start: oneHourAgo(), end: Date.now() / 1000 },
        true
      ).catch(console.error)
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
          {...{ initializeLive, handleLive }}
          data={standardData}
          useDownload={useDownloadStandardData}
          useDelete={useDeleteStandardData}
          yDomain={[-1, 100]}
          render={(live) =>
            live || <DomainSelector useGetData={useGetStandardData} />
          }
        ></Chart>
      </>
    )
  }
