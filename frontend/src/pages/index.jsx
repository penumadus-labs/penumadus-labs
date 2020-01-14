import React from 'react'
import styled from 'styled-components'
import Button from '../components/ui/Button.jsx'
import { login } from '../utils/auth'

const Root = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`

export default () => (
  <Root>
    <Button onClick={login}>login</Button>
  </Root>
)
