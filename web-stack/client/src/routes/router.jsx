import React from 'react'
import { Router } from '@reach/router'
import Login from '../components/forms/login'
import Layout from '../layout/layout'
import Charts from './charts'
// import ControlPanel from './admin/control-panel'
import Register from './register'
import NotFound from './404'

import useAuth from '../hooks/use-auth'

export default () => {
  const [{ loading, loggedIn }, { login }] = useAuth()

  if (loading) return <p>loading...</p>

  if (!loggedIn) return <Login handleLogin={login} />

  return (
    <Layout>
      <Router className='space-children-y'>
        <Charts path='/' />
        {/* <ControlPanel path='control-panel' /> */}
        <Register path='register' />
        <NotFound default />
      </Router>
    </Layout>
  )
}
