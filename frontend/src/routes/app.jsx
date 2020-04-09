import React from 'react'
import { Router } from '@reach/router'
import Layout from '../layout/layout'
import Charts from './app/charts'
import ControlPanel from './app/control-panel'
import Register from './app/register'
import Logout from './app/logout'
import InvalidRoute from './404'
import useAuth from '../hooks/use-auth'

export default ({ navigate }) => {
  const authenticated = true

  return authenticated ? (
    <Layout>
      <Router path="app">
        <Charts path="charts" />
        <ControlPanel path="control-panel" />
        <Register path="register" />
        <Logout path="logout" />
        <InvalidRoute default />
      </Router>
    </Layout>
  ) : null
}
