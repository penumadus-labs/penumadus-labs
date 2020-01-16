import React from 'react'
import { Router } from '@reach/router'
import Layout from '../layout/Layout.jsx'
import Charts from '../routes/Charts.jsx'
import ControlPanel from '../routes/ControlPanel.jsx'
import Devices from '../routes/Devices.jsx'
import Logout from '../routes/Logout.jsx'
import { checkAuth } from '../utils/auth.js'

export default () => {
  if (!checkAuth()) return null
  return (
    <Layout>
      <Router>
        <Charts path='/app/charts' />
        <ControlPanel path='/app/control-panel' />
        <Devices path='/app/devices' />
        <Logout path='/app/logout' />
      </Router>
    </Layout>
  )
}
