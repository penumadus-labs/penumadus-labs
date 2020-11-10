import { Router } from '@reach/router'
import React from 'react'
import AccelerationChart from '../components/charts/acceleration/acceleration-chart.jsx'
import EnvironmentChart from '../components/charts/environment/environment-chart.jsx'
import NotFound from './404'
import Controls from './controls'
import Register from './register'

export default () => {
  return (
    <Router className="space-children-y">
      <EnvironmentChart path="environment" />
      <AccelerationChart path="acceleration" />
      <Controls path="controls" />
      <Register path="register" />
      <NotFound default />
    </Router>
  )
}
