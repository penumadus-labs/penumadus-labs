import React from 'react'
import { Router } from '@reach/router'
import Layout from '../layout/layout'
import Charts from '../routes/charts'
import ControlPanel from '../routes/control-panel'
import Register from '../routes/register'
import Logout from '../routes/logout'
import { checkAuth } from '../utils/auth'

export default () => {
  if (!checkAuth()) return null
  return (
    <Layout>
      <Router>
        <Charts path="/app/charts" />
        <ControlPanel path="/app/control-panel" />
        <Register path="/app/register" />
        <Logout path="/app/logout" />
      </Router>
    </Layout>
  )
}
