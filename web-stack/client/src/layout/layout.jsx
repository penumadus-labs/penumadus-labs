import React from 'react'
import styled from '@emotion/styled'
import NavBar from './nav-bar'
import StatusBar from './status-bar'
import Router from '../router/router'
import Login from '../components/forms/login'
import useAuth from '../context/auth/context'

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
    .login {
      grid-column-start: 2;
      margin-right: var(--nav-size);
    }
  }

  ${({ theme }) => theme.le.layout} {
    grid-template-rows: auto minmax(0, 1fr) auto;
  }

  header {
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
    overflow-y: auto;
  }

  .login {
    padding: var(--sm);
  }
`

const Layout = ({ children }) => {
  const [{ loading, loggedIn }, { login, logout }] = useAuth()

  const body = loading ? null : !loggedIn ? (
    <div className="login">
      <Login handleLogin={login} />
    </div>
  ) : (
    <>
      <main className="space-children-y">
        <StatusBar />
        <Router />
      </main>
      <NavBar handleLogout={logout} />
    </>
  )

  return (
    <Root>
      <header>
        <p>HankMon Dashboard</p>
      </header>
      {body}
    </Root>
  )
}

export default Layout
