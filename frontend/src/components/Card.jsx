import React from 'react'
import styled from 'styled-components'

const Root = styled.div`
  margin: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.color.navBackground};
`

export default ({ children }) => <Root>{children}</Root>
