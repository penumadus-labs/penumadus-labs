import React from 'react'
import styled from '@emotion/styled'
import { FaChartLine as Chart } from 'react-icons/fa'
import { MdDashboard as Dash, MdDevices as Devices } from 'react-icons/md'
import { FiLogOut as Logout } from 'react-icons/fi'
import NavBarLink from './nav-bar-link'
import { useAuthActions } from '../hooks/use-auth'

const Root = styled.nav`
  ${({ theme }) => theme.layout} {
    right: 0;
    display: flex;
    justify-content: space-evenly;
    height: auto;
  }
  position: fixed;
  bottom: 0;
  left: 0;
  height: calc(100vh - var(--header-size));
  background: var(--card-background);
`

const NavBar = ({ width }) => {
  const { logout } = useAuthActions()

  return (
    <Root className='shadow' width={width}>
      <NavBarLink Icon={Chart} label='Charts' to='/' />
      <NavBarLink Icon={Dash} label='Controls' to='controls' />
      <NavBarLink Icon={Devices} label='Register' to='register' />
      <NavBarLink Icon={Logout} label='Logout' to='/' onClick={logout} />
    </Root>
  )
}

export default NavBar
