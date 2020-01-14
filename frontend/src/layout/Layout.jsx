import React from 'react'
import NavBar from './NavBar.jsx'
import Main from './Main.jsx'

const Layout = ({ children }) => (
  <>
    <Main>{children}</Main>
    <NavBar />
  </>
)

export default Layout
