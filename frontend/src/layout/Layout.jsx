import React from 'react'
import { DatabaseContextProvider } from '../context/database/database'
import NavBar from './nav-bar'
import Main from './main'

const Layout = ({ children }) => (
  <>
    <DatabaseContextProvider>
      <Main>{children}</Main>
    </DatabaseContextProvider>
    <NavBar />
  </>
)

export default Layout
