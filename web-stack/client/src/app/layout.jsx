import styled from '@emotion/styled'
import React from 'react'
import useApi from '../api'
import Router from '../router/router'
import useAuth from '../services/auth'
import useMessage, { useSocket } from '../services/socket'
import Login from './login'
import NavBar from './nav-bar'
import StatusBar from './status-bar'

const Root = styled.div`
  display: grid;
  height: 100vh;

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
    z-index: var(--layer1);
  }

  header > p {
    padding: var(--sm);
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
  }
`

const Layout = ({ children }) => {
  const [{ verifying, loggedIn }, { login, loginStatus, logout }] = useAuth()
  const [, { getSettings }] = useApi()
  useSocket(loggedIn)
  useMessage(({ type }) => {
    if (type === 'settings') getSettings()
  })

  const body = verifying ? null : !loggedIn ? (
    <div>
      <Login handleLogin={login} status={loginStatus} />
    </div>
  ) : (
    <>
      <main>
        <Router />
      </main>
      <NavBar handleLogout={logout} />
    </>
  )

  return (
    <Root>
      <header className="shadow-card">
        <p>HankMon Dashboard</p>
        <StatusBar loggedIn={loggedIn} />
      </header>
      {body}
    </Root>
  )
}

export default Layout
