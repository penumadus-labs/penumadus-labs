import React from 'react'
import { Router } from '@reach/router'
import Layout from '../layout/Layout.jsx'
import Graphs from '../routes/Graphs.jsx'
import ControlPanel from '../routes/ControlPanel.jsx'
import Devices from '../routes/Devices.jsx'

export default () => (
  <Layout>
    <Router>
      <Graphs path='/app/graphs' />
      <ControlPanel path='/app/control-panel' />
      <Devices path='/app/devices' />
    </Router>
  </Layout>
)
