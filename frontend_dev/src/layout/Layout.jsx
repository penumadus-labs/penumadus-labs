import React from 'react'
import { Link } from 'gatsby'

const activeColor = 'blue'

const Nav = () => (
  <nav>
    <Link to="/" iscurrent={{ color: activeColor }}>
      home
    </Link>
    <Link to="/control-panel" iscurrent={{ color: activeColor }}>
      control panel
    </Link>
    <Link to="/api-test" iscurrent={{ color: activeColor }}>
      api test
    </Link>
    {/* <Link to="/link" iscurrent={{ color: activeColor }}>
      link 4
    </Link> */}
  </nav>
)

const Layout = ({ children }) => (
  <>
    <header>
      <Nav />
    </header>
    <main>{children}</main>
    <footer></footer>
  </>
)

export default Layout
