import React from 'react'
import styled from '@emotion/styled'
import StatusBar from './status-bar'
const Root = styled.main`
  ${({ theme }) => theme.mediaQueries.layout} {
    height: calc(100vh - var(--header-size) - var(--nav-size));
    margin-left: 0;
  }
  height: calc(100vh - var(--header-size));
  margin-left: var(--nav-size);
  padding: var(--sm);
  overflow-y: auto;
`
const Main = ({ children }) => {
  return (
    <Root className='space-children-y'>
      <StatusBar />
      {children}
    </Root>
  )
}

export default Main
