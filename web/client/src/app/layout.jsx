import styled from '@emotion/styled'
import React from 'react'
import useAuth from '../services/auth'
import { useSocket } from '../services/socket'
import Login from './login'
import Routes from '../router/routes'
import StatusBar from './status-bar'
import ErrorBoundary from '../components/error-boundary'

const Root = styled.div`
  display: grid;
  height: 100%;

  ${({ theme }) => theme.gt.layout} {
    grid-template-rows: auto minmax(0, 1fr);
    grid-template-columns: auto minmax(0, 1fr);
    header {
      grid-column-start: 1;
      grid-column-end: 3;
    }
    nav {
      grid-row-start: 2;
    }
  }

  ${({ theme }) => theme.le.layout} {
    grid-template-rows: auto minmax(0, 1fr) auto;
  }

  header {
    padding: var(--xs);
  }

  header > p {
    padding-bottom: var(--xs);
    font-size: var(--lg);
    background: var(--card-background);

    ${({ theme }) => theme.le.layout} {
      text-align: center;
    }
  }

  nav {
    background: var(--card-background);
    ${({ theme }) => theme.le.layout} {
      display: flex;
      justify-content: space-evenly;
    }
  }

  main {
    padding: var(--sm);
    overflow: auto;
    height: 100%;
  }
`

const Layout = () => {
  const [
    { verifying, loggedIn },
    { handleLogin, loginStatus, handleLogout },
  ] = useAuth()

  useSocket(loggedIn)

  if (verifying) return null

  if (!loggedIn) return <Login handleLogin={handleLogin} status={loginStatus} />

  return (
    <Root>
      <header className="card">
        <ErrorBoundary message="status bar has crashed">
          <StatusBar />
        </ErrorBoundary>
      </header>
      <Routes handleLogout={handleLogout} />
    </Root>
  )
}

export default Layout
