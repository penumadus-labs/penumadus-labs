import { Router } from '@reach/router'
import React from 'react'
import AccelerationChart from '../components/charts/acceleration/acceleration-chart.jsx'
import StandardChart from '../components/charts/standard/standard-chart.jsx'
import NotFound from './404'

export default () => {
  return (
    <Router>
      <StandardChart
        path="standard"
        // state={standardData}
        // getData={getStandardData}
        // useGetStandardData={useGetStandardData}
        // useDownload={useDownloadStandardData}
        // useDelete={useDeleteStandardData}
      />
      <AccelerationChart
        path="acceleration"
        // events={accelerationEvents}
        // getEvents={getAccelerationEvents}
        // useDelete={useDeleteAccelerationEvents}
        // event={accelerationEvent}
        // getEvent={getAccelerationEvent}
        // useGetEvent={useGetAccelerationEvent}
        // useDownload={useDownloadAccelerationEvent}
      />
      <NotFound default />
    </Router>
  )
}
