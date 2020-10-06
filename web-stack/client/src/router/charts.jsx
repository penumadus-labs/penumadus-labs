import { Router } from '@reach/router'
import React from 'react'
import AccelerationChart from '../components/charts/acceleration/acceleration-chart.jsx'
import StandardChart from '../components/charts/standard/standard-chart.jsx'
import useApi from '../context/api'
import NotFound from './404'

export default () => {
  const [
    { standardData, accelerationEvents },
    { getStandardData },
    {
      useGetStandardData,
      useDownloadStandardData,
      useDeleteStandardData,
      useGetAccelerationData,
      useDownloadAccelerationData,
      useDeleteAccelerationEvents,
    },
  ] = useApi()

  return (
    <Router>
      <StandardChart
        path="standard"
        state={standardData}
        getData={getStandardData}
        useGetData={useGetStandardData}
        useDownload={useDownloadStandardData}
        useDelete={useDeleteStandardData}
      />
      <AccelerationChart
        path="acceleration"
        events={accelerationEvents}
        useGetData={useGetAccelerationData}
        useDownload={useDownloadAccelerationData}
        useDelete={useDeleteAccelerationEvents}
      />
      <NotFound default />
    </Router>
  )
}
