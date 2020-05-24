import React from 'react'
import styled from '@emotion/styled'

const Root = styled.header`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.le.layout} {
    justify-content: center;
  }

  height: var(--header-size);
  font-size: var(--lg);
  background: var(--card-background);
`

const Header = styled.p`
  margin-left: var(--md);
`

export default ({ children }) => (
  <Root className="shadow">
    <Header>HankMon Dashboard</Header>
  </Root>
)
