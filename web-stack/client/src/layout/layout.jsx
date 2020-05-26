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
    grid-template-rows: var(--nav-size) auto;
    grid-template-columns: var(--nav-size) auto var(--nav-size);
    nav {
      grid-row-start: 2;
      grid-column-start: 1;
    }
    main {
      grid-column-start: 2;
      grid-column-end: 4;
    }
    .login {
      grid-column-start: 2;
      margin-right: var(--nav-size);
    }
  }

  ${({ theme }) => theme.le.layout} {
    grid-template-rows: var(--nav-size) auto var(--nav-size);
    grid-template-columns: 1fr;

    main {
      grid-row-start: 2;
    }
    nav {
      grid-row-start: 3;
    }
  }

  header {
    grid-column-start: 1;
    grid-column-end: 4;
    padding: var(--md);
    font-size: var(--lg);
    background: var(--card-background);

    ${({ theme }) => theme.le.layout} {
      text-align: center;
    }
  }

  nav {
    ${({ theme }) => theme.le.layout} {
      display: flex;
      justify-content: space-evenly;
    }

    background: var(--card-background);
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
  const [{ loggedIn }, { login, logout }] = useAuth()

  const body = !loggedIn ? (
    <div className="login">
      <Login handleLogin={login} />
    </div>
  ) : (
    <>
      <NavBar handleLogout={logout} />
      <main className="space-children-y">
        <StatusBar />
        <Router />
      </main>
    </>
  )

  return (
    <Root>
      <header>
        <h3>HankMon Dashboard</h3>
      </header>
      {body}
    </Root>
  )
}

export default Layout
