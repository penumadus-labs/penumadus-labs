import React, { useMemo, useEffect } from 'react'
import { Router, navigate } from '@reach/router'

import {
  // FaChartLine as Environment,
  FaThermometerHalf as Environment,
} from 'react-icons/fa'
import { VscSymbolRuler as Deflection } from 'react-icons/vsc'
import { IoMdSpeedometer as Acceleration } from 'react-icons/io'
import { FiLogOut as Logout } from 'react-icons/fi'
import { MdDashboard as Dashboard, MdDevices as Devices } from 'react-icons/md'

import useApi from '../api'
import Link from './link'

import AccelerationChart from '../components/charts/acceleration/chart'
import EnvironmentChart from '../components/charts/environment-chart'
import DeflectionChart from '../components/charts/deflection-chart'

import Controls from './controls'
import Register from './register'

const staticRoutes = ['register']

const icons = {
  environment: Environment,
  deflection: Deflection,
  acceleration: Acceleration,
  controls: Dashboard,
  register: Devices,
}

const Components = {
  environment: EnvironmentChart,
  deflection: DeflectionChart,
  acceleration: AccelerationChart,
  controls: Controls,
  register: Register,
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

  const { requests, paths, apiRequests } = useMemo(() => {
    const requests = [...dataFields, ...(configurable ? ['controls'] : [])]

    const paths = [...requests, ...staticRoutes]

    const apiRequests = {
      environment: () => getEnvironment({ recent: true }, true),
      deflection: () => getDeflection({ recent: true }, true),
      acceleration: () => getAcceleration(true),
      controls: () => {
        getProtocol()
        getSettings()
      },
    }

    return { requests, paths, apiRequests }
  }, [
    dataFields,
    configurable,
    getProtocol,
    getSettings,
    getEnvironment,
    getDeflection,
    getAcceleration,
  ])

  // changes data when device is toggled

  useEffect(() => {
    // fetches the data for each field
    // navigates to first field once it's resolved

    // could do this, if clear data from top level to reinstate loading
    // if (!paths.includes(window.location.pathname.slice(1))) navigate(paths[0])

    requests.forEach(async (field, index) => {
      await apiRequests[field]()

      // navigate to valid route on page load or device change
      if (index === 0 && !paths.includes(window.location.pathname.slice(1)))
        navigate(field)
    })
  }, [id, apiRequests, paths, requests])

  const routes = paths.map((field) => {
    const Route = Components[field]
    return <Route key={field} path={field} />
  })

  const links = paths.map((field) => (
    <Link
      key={field}
      Icon={icons[field]}
      label={`${field[0].toUpperCase()}${field.slice(1)}`}
      to={`${field}`}
    />
  ))

  return (
    <>
      <main>
        <Router className="space-children-y">{routes}</Router>
      </main>
      <nav className="shadow-card">
        {links}
        <Link
          Icon={Logout}
          label="Logout"
          to={window.location.pathname}
          onClick={handleLogout}
        />
      </nav>
    </>
  )
}
