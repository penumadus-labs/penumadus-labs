import React, { useEffect } from 'react'
import { Router, navigate } from '@reach/router'

import { FaChartLine as Environment } from 'react-icons/fa'
import { VscSymbolRuler as Deflection } from 'react-icons/vsc'
import { IoMdSpeedometer as Acceleration } from 'react-icons/io'
import { FiLogOut as Logout } from 'react-icons/fi'
import { MdDashboard as Dash, MdDevices as Devices } from 'react-icons/md'

import useApi from '../api'
import Link from './link'

import AccelerationChart from '../components/charts/acceleration/chart'
import EnvironmentChart from '../components/charts/environment-chart'
import DeflectionChart from '../components/charts/deflection-chart'

import Controls from './controls'
import Register from './register'
import NotFound from './404'

const icons = {
  environment: Environment,
  deflection: Deflection,
  acceleration: Acceleration,
}

const routeComponents = {
  environment: EnvironmentChart,
  deflection: DeflectionChart,
  acceleration: AccelerationChart,
}
// creates routes, links, and data fetches based on device's data fields
// configurable device includes control panel for configuring device remotely
export default ({ handleLogout }) => {
  const [
    {
      device: { id, dataFields, configurable },
    },
    {
      getProtocol,
      getSettings,
      getEnvironment,
      getDeflection,
      getAcceleration,
    },
  ] = useApi()

  const apiRequests = {
    environment: () => getEnvironment({ recent: true }, true),
    deflection: () => getDeflection({ recent: true }, true),
    acceleration: () => getAcceleration(true),
  }

  // changes data when device is toggled

  useEffect(() => {
    if (configurable) {
      getProtocol()
      getSettings()
    }

    // fetches the data for each field
    // navigates to first field once it's resolved

    const currentDevice = localStorage.getItem('id')

    dataFields.forEach(async (field, index) => {
      await apiRequests[field]()
      // redirect to first request if id has changed or path = home
      if (
        index === 0 &&
        (currentDevice !== id || window.location.pathname === '/')
      ) {
        localStorage.setItem('id', id)
        await navigate(`/${field}`)
      }
    })
    // eslint-disable-next-line
  }, [id])

  const routes = dataFields.map((field) => {
    const Route = routeComponents[field]
    return <Route key={field} path={field} />
  })

  const links = dataFields.map((field) => (
    <Link
      key={field}
      style={{ fontSize: '10px' }}
      Icon={icons[field]}
      label={field}
      to={`${field}`}
    />
  ))

  return (
    <>
      <main>
        <Router className="space-children-y">
          {routes}
          {configurable && <Controls path="controls" />}
          <Register path="register" />
          <NotFound default />
        </Router>
      </main>
      <nav className="shadow-card raised">
        {links}
        {configurable && <Link Icon={Dash} label="Controls" to="controls" />}
        <Link Icon={Devices} label="Register" to="register" />
        <Link Icon={Logout} label="Logout" to="/" onClick={handleLogout} />
      </nav>
    </>
  )
}
