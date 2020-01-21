import React from 'react'
import { Provider } from '../context/Devices.jsx'
import NavBar from './NavBar.jsx'
import Main from './Main.jsx'

const Layout = ({ children }) => (
  <>
    <Provider>
      <Main>{children}</Main>
    </Provider>
    <NavBar />
  </>
)

export default Layout
