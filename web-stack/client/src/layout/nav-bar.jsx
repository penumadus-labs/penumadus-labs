import React from 'react'
import { FaChartLine as Chart } from 'react-icons/fa'
import { MdDashboard as Dash, MdDevices as Devices } from 'react-icons/md'
import { FiLogOut as Logout } from 'react-icons/fi'
import NavBarLink from './nav-link'

const NavBar = ({ handleLogout }) => (
  <nav className="shadow-card raised">
    <NavBarLink Icon={Chart} label="Charts" to="/" />
    <NavBarLink Icon={Dash} label="Controls" to="controls" />
    <NavBarLink Icon={Devices} label="Register" to="register" />
    <NavBarLink Icon={Logout} label="Logout" to="/" onClick={handleLogout} />
  </nav>
)

export default NavBar
