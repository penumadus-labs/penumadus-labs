import React from 'react'
import { FaChartLine as Environment } from 'react-icons/fa'
import { VscSymbolRuler as Deflection } from 'react-icons/vsc'
import { IoMdSpeedometer as Acceleration } from 'react-icons/io'
import { FiLogOut as Logout } from 'react-icons/fi'
import { MdDashboard as Dash, MdDevices as Devices } from 'react-icons/md'
import NavBarLink from './nav-link'

const NavBar = ({ handleLogout }) => (
  <nav className="shadow-card raised">
    <NavBarLink
      style={{ fontSize: '10px' }}
      Icon={Environment}
      label="Environment"
      to="/environment"
    />
    <NavBarLink
      style={{ fontSize: '10px' }}
      Icon={Deflection}
      label="Deflection"
      to="/deflection"
    />
    <NavBarLink
      style={{ fontSize: '10px' }}
      Icon={Acceleration}
      label="Acceleration"
      to="/acceleration"
    />
    <NavBarLink Icon={Dash} label="Controls" to="controls" />
    <NavBarLink Icon={Devices} label="Register" to="register" />
    <NavBarLink Icon={Logout} label="Logout" to="/" onClick={handleLogout} />
  </nav>
)

export default NavBar
