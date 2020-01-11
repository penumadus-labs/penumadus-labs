import React from 'react'
import styled from 'styled-components'
import NavBarLink from './NavBarLink.jsx'
import { FaChartLine as Chart } from 'react-icons/fa'
import { MdDashboard as Dash, MdDevices as Devices } from 'react-icons/md'

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

const NavBar = ({ width }) => (
  <Root width={width}>
    <NavBarLink Icon={Chart} label='Graphs' />
    <NavBarLink Icon={Dash} label='Control panel' />
    <NavBarLink Icon={Devices} label='Devices' />
  </Root>
)

export default NavBar
