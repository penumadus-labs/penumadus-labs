import React, { useMemo, useEffect } from 'react'
import { Router, navigate } from '@reach/router'
import ErrorBoundary from '../components/error-boundary'

import { FaThermometerHalf as Environment } from 'react-icons/fa'
import { VscSymbolRuler as Deflection } from 'react-icons/vsc'
import { IoMdSpeedometer as Acceleration } from 'react-icons/io'
import { IoMdDocument as UserManual } from 'react-icons/io'
import { FiLogOut as Logout } from 'react-icons/fi'
import { MdDashboard as Dashboard, MdDevices as Devices } from 'react-icons/md'

import useApi from '../api'
import Link from './link'

// import AccelerationChart from '@web/d3-charts/acceleration'
// import EnvironmentChart from '@web/d3-charts/environment'
// import DeflectionChart from '@web/d3-charts/deflection'

import AccelerationChart from '../components/charts/acceleration'
// import EnvironmentChart from '../components/charts/environment'
import DeflectionChart from '../components/charts/deflection'

import TestChart from '../test/index'

import Controls from './controls'
import Register from './register'
import Manual from './manual'

const staticRoutes = ['register', 'manual']

const icons = {
  environment: Environment,
  deflection: Deflection,
  acceleration: Acceleration,
  controls: Dashboard,
  register: Devices,
  manual: UserManual,
}

const Components = {
  environment: TestChart,
  deflection: DeflectionChart,
  acceleration: AccelerationChart,
  controls: Controls,
  register: Register,
  manual: Manual,
}

// creates routes, links, and data fetches based on device's data fields
// configurable device includes control panel for configuring device remotely
export default function Routes({ handleLogout }) {
  const [
    {
      device: { id, dataTypes, configurable },
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
    const requests = [...dataTypes, ...(configurable ? ['controls'] : [])]

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
    dataTypes,
    configurable,
    getProtocol,
    getSettings,
    getEnvironment,
    getDeflection,
    getAcceleration,
  ])

  // changes data when device is toggled
  useEffect(() => {
    requests.forEach(async (field, index) => {
      // fetches the data for each field
      const path = window.location.pathname.slice(1)
      if (index === 0 && !paths.includes(path)) navigate(`/${field}`) // navigate to valid route on page load or device change

      await apiRequests[field]()
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
        <ErrorBoundary card={true} message="application body has crashed">
          <Router className="space-children-y height100">
            {routes}
            <TestChart path="test" />
          </Router>
        </ErrorBoundary>
      </main>
      <nav className="shadow-card">
        {links}
        <Link Icon={Logout} label="Logout" to={''} onClick={handleLogout} />
      </nav>
    </>
  )
}
