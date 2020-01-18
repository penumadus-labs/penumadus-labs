import React from 'react'
import { Router } from '@reach/router'
import Layout from '../layout/Layout.jsx'
import Charts from '../routes/Charts.jsx'
import ControlPanel from '../routes/ControlPanel.jsx'
import Register from '../routes/Register.jsx'
import Logout from '../routes/Logout.jsx'
import { checkAuth } from '../utils/auth.js'

export default () => {
  if (!checkAuth()) return null
  return (
    <Layout>
      <Router>
        <Charts path='/app/charts' />
        <ControlPanel path='/app/control-panel' />
        <Register path='/app/register' />
        <Logout path='/app/logout' />
      </Router>
    </Layout>
  )
}
