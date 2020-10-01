import { Router } from '@reach/router'
import React from 'react'
import NotFound from './404'
import Charts from './charts'
import Controls from './controls'
import Register from './register'

export default () => {
  return (
    <Router className="space-children-y">
      <Charts path="charts/*" />
      <Controls path="controls" />
      <Register path="register" />
      <NotFound default />
    </Router>
  )
}
