import { Router } from '@reach/router'
import React from 'react'
import AccelerationChart from '../components/charts/acceleration/acceleration-chart.jsx'
import StandardChart from '../components/charts/standard/standard-chart.jsx'
import NotFound from './404'
import Controls from './controls'
import Register from './register'

export default () => {
  return (
    <Router className="space-children-y">
      <StandardChart path="standard" />
      <AccelerationChart path="acceleration" />
      <Controls path="controls" />
      <Register path="register" />
      <NotFound default />
    </Router>
  )
}
