import { Router } from '@reach/router'
import React from 'react'
import AccelerationChart from '../components/charts/acceleration/acceleration-chart.jsx'
import EnvironmentChart from '../components/charts/environment/environment-chart.jsx'
import NotFound from './404'

export default () => {
  return (
    <Router>
      <EnvironmentChart
        path="environment"
        // state={environment}
        // getData={getEnvironment}
        // useGetEnvironment={useGetEnvironment}
        // useDownload={useDownloadEnvironment}
        // useDelete={useDeleteEnvironment}
      />
      <AccelerationChart
        path="acceleration"
        // events={acceleration}
        // getEvents={getAcceleration}
        // useDelete={useDeleteAcceleration}
        // event={accelerationEvent}
        // getEvent={getAccelerationEvent}
        // useGetEvent={useGetAccelerationEvent}
        // useDownload={useDownloadAccelerationEvent}
      />
      <NotFound default />
    </Router>
  )
}
