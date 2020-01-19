import React from 'react'
import styled from 'styled-components'
import Dropdown from '../components/ui/Dropdown.jsx'

const Root = styled.main`
  ${({ theme }) => theme.mediaQueries.layout} {
    height: ${({ theme }) =>
      `calc(100vh - ${theme.layout.header.height} - ${theme.layout.navbar.size}) `};
    margin-left: 0;
  }
  height: ${({ theme }) => `calc(100vh - ${theme.layout.header.height}) `};
  margin-left: ${({ theme }) => theme.layout.navbar.size};
  overflow-y: auto;
`

const Main = ({ children }) => {
  return (
    <Root>
      <Dropdown />
      {children}
    </Root>
  )
}

export default Main
