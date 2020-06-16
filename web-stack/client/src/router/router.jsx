import React from 'react'
import { Router } from '@reach/router'
import Charts from './charts'
import Controls from './controls'
import Register from './register'
import NotFound from './404'

import Colors from './colors'

export default () => {
  return (
    <Router>
      <Charts path="/charts" />
      <Controls path="controls" />
      <Register path="register" />
      <NotFound default />

      <Colors path="colors" />
    </Router>
  )
}
