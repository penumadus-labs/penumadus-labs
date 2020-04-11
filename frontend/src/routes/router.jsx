import React from 'react'
import { Router } from '@reach/router'
import Login from './login'
import Callback from './callback'
import InvalidRoute from './404'
import NavigateRoute from './navigate-root'

import Layout from '../layout/layout'
import Charts from './admin/charts'
import ControlPanel from './admin/control-panel'
import Register from './admin/register'
import Logout from './admin/logout'
import { checkAuth } from '../utils/auth'

export default () => {
  const authorized = checkAuth()

  if (authorized) console.log('authorized')

  return (
    <Router>
      <Login path="/" />
      <Callback path="callback" />
      {authorized ? (
        <Layout path="admin">
          <Charts path="charts" />
          <ControlPanel path="control-panel" />
          <Register path="register" />
          <Logout path="logout" />
          <InvalidRoute default />
        </Layout>
      ) : null}
      <NavigateRoute default />
    </Router>
  )
}
