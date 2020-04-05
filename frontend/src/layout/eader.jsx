import React from 'react'
import styled from 'styled-components'

const Root = styled.header`
display: flex;
align-items: center;

${({ theme }) => theme.mediaQueries.layout} {
  justify-content: center;
}

height: ${({ theme }) => theme.layout.header.height};
font-size: ${({ theme }) => theme.font.size.heading};
background: ${({ theme }) => theme.color.navBackground};

/* border-bottom: 1px solid ${({ theme }) => theme.color.border}; */

svg {
  cursor: pointer;
}

> * {
  margin-left: ${({ theme }) => theme.spacing.lg};
}
`

const Header = ({ children }) => (
  <Root>
    <p>HankMon Dashboard</p>
  </Root>
)

export default Header
