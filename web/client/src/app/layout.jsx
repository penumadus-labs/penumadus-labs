import styled from '@emotion/styled'
import React, { useRef, useEffect } from 'react'
import useAuth from '../services/auth'
import { useSocket } from '../services/socket'
import Login from './login'
import Routes from '../router/routes'
import StatusBar from './status-bar'

const Root = styled.div`
  display: grid;
  height: ${window.innerHeight}px;

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

let timeout

const Layout = () => {
  const [
    { verifying, loggedIn },
    { handleLogin, loginStatus, handleLogout },
  ] = useAuth()
  useSocket(loggedIn)

  const ref = useRef()

  useEffect(() => {
    const resizeEvent = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        ref.current.style.height = `${window.innerHeight}px`
      }, 200)
    }
    window.addEventListener('resize', resizeEvent)
    return () => {
      window.removeEventListener('resize', resizeEvent)
    }
  }, [])

  const main = verifying ? null : !loggedIn ? (
    <Login handleLogin={handleLogin} status={loginStatus} />
  ) : (
    <Routes handleLogout={handleLogout} />
  )

  return (
    <Root ref={ref}>
      <header className="card">
        <p>HankMon Dashboard</p>
        {loggedIn && <StatusBar />}
      </header>
      {main}
    </Root>
  )
}

export default Layout
