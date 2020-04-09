import React from 'react'
import { Router } from '@reach/router'
import Layout from '../layout/layout'
import Charts from './admin/charts'
import ControlPanel from './admin/control-panel'
import Register from './admin/register'
import Logout from './admin/logout'
import InvalidRoute from './404'
import useAuth from '../hooks/use-auth'

export default ({ navigate }) => {
  const authenticated = useAuth()

  console.log(authenticated)

  return authenticated ? (
    <Layout>
      <Router path="admin">
        <Charts path="charts" />
        <ControlPanel path="control-panel" />
        <Register path="register" />
        <Logout path="logout" />
        <InvalidRoute default />
      </Router>
    </Layout>
  ) : null
}
