import React from 'react'
import { DatabaseContextProvider } from '../context/database/database'
import { SocketContextProvider } from '../context/socket/socket'
import NavBar from './nav-bar'
import Main from './main'

const Layout = ({ children }) => (
  <>
    <DatabaseContextProvider>
      <SocketContextProvider>
        <Main>{children}</Main>
        <NavBar />
      </SocketContextProvider>
    </DatabaseContextProvider>
  </>
)

export default Layout
