import React from 'react'
import { Router } from '@reach/router'
import Charts from './charts'
import Controls from './controls'
import Register from './register'
import NotFound from './404'

export default () => {
  return (
    <Router className="space-children-y">
      <Charts path="/" />
      <Controls path="controls" />
      <Register path="register" />
      <NotFound default />
    </Router>
  )
}
