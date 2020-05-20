import React from 'react'
import NavBar from './nav-bar'
import Main from './main'

const Layout = ({ children }) => (
  <>
    <Main>{children}</Main>
    <NavBar />
  </>
)

export default Layout
