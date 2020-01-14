import React from 'react'
import { Router } from '@reach/router'
import Layout from '../layout/Layout.jsx'
import Graphs from '../routes/Graphs.jsx'
import ControlPanel from '../routes/ControlPanel.jsx'
import Devices from '../routes/Devices.jsx'
import Logout from '../routes/Logout.jsx'
import { checkAuth } from '../utils/auth.js'

export default () => {
  if (!checkAuth()) return null
  return (
    <Layout>
      <Router>
        <Graphs path='/app/graphs' />
        <ControlPanel path='/app/control-panel' />
        <Devices path='/app/devices' />
        <Logout path='/app/logout' />
      </Router>
    </Layout>
  )
}
