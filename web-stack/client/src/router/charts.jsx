import React from 'react'
import StandardChart from '../components/charts/standard/standard-chart.jsx'
import useApi from '../context/api'
import AccelerationChart from '../components/charts/acceleration/acceleration-chart.jsx'

export default () => {
  const [
    { standardData, accelerationEvents, accelerationData },
    { getStandardData, getAccelerationData },
    {
      useGetStandardData,
      useDownloadStandardData,
      useGetAccelerationData,
      useDownloadAccelerationData,
    },
  ] = useApi()

  return (
    <>
      <StandardChart
        state={standardData}
        getData={getStandardData}
        useDownload={useDownloadStandardData}
        useGetData={useGetStandardData}
      />
      <AccelerationChart
        events={accelerationEvents}
        data={accelerationData}
        getData={getAccelerationData}
        useGetData={useGetAccelerationData}
        useDownload={useDownloadAccelerationData}
      />
    </>
  )
}
