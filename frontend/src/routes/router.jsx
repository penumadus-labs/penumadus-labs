import React from 'react'
import { Router } from '@reach/router'
import Login from './login'
import Callback from './callback'
import Admin from './admin'
import InvalidRoute from './404'
// import Layout from '../layout/layout'
// import Charts from './app/charts'
// import ControlPanel from './app/control-panel'
// import Register from './app/register'
// import Logout from './app/logout'
// import { checkAuth } from '../utils/auth'

export default () => {
  return (
    <Router>
      <Login path="/" />
      <Callback path="callback" />
      <Admin path="admin/*" />
      <InvalidRoute default />
    </Router>
  )
}
