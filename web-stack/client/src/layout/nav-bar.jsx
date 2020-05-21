import React from 'react'
import styled from 'styled-components'
import { FaChartLine as Chart } from 'react-icons/fa'
import { MdDashboard as Dash, MdDevices as Devices } from 'react-icons/md'
import { FiLogOut as Logout } from 'react-icons/fi'
import NavBarLink from './nav-bar-link'
import { useAuthActions } from '../hooks/use-auth'

const Root = styled.nav`
  ${({ theme }) => theme.mediaQueries.layout} {
    right: 0;
    display: flex;
    justify-content: space-evenly;
    height: auto;
  }
  position: fixed;
  bottom: 0;
  left: 0;
  height: ${({ theme }) => `calc(100vh - ${theme.layout.header.height}) `};
  background: ${({ theme }) => theme.color.navBackground};
`

const NavBar = ({ width }) => {
  const { logout } = useAuthActions()

  return (
    <Root width={width}>
      <NavBarLink Icon={Chart} label='Charts' to='/' />
      <NavBarLink Icon={Dash} label='Control panel' to='control-panel' />
      <NavBarLink Icon={Devices} label='Register' to='register' />
      <NavBarLink Icon={Logout} label='Logout' to='/' onClick={logout} />
    </Root>
  )
}

export default NavBar
