import React from 'react'
import useApi from './client/src/api'
import Chart from './client/src/components/charts/chart/chart'
import {
  oneHourAgo,
  oneHourInSeconds,
} from './client/src/components/charts/utils/datetime'
import DomainSelector from './client/src/components/charts/linear-data/domain-selector'

export default () =>
  //   {
  //   state: [status, payload],
  //   getData,
  //   useGetEnvironment,
  //   ...props
  // }
  {
    const [
      { environment },
      { getEnvironment },
      { useGetEnvironment, useDownloadEnvironment, useDeleteEnvironment },
    ] = useApi()

    const initializeLive = () => {
      return getEnvironment(
        { start: oneHourAgo(), end: Date.now() / 1000 },
        true
      ).catch(console.error)
    }

    const handleLive = ({ type, data, setLiveData }) => {
      if (type !== 'environment') return
      setLiveData((liveData) => [
        ...liveData.slice(+(data.time - liveData[0].time >= oneHourInSeconds)),
        data,
      ])
    }

    return (
      <>
        <Chart
          {...{ initializeLive, handleLive }}
          data={environment}
          useDownload={useDownloadEnvironment}
          useDelete={useDeleteEnvironment}
          yDomain={[-1, 100]}
          render={({ live }) =>
            live || <DomainSelector useGetData={useGetEnvironment} />
          }
        ></Chart>
      </>
    )
  }
