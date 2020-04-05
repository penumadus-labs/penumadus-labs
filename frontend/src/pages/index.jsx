import React from 'react'
import styled from 'styled-components'
import Button from '../components/ui/button'
import { login } from '../utils/auth'
import theme from '../style/theme'

const Root = styled.div`
  ${({ theme }) => theme.mixins.card};
  margin-right: 0;
  margin-left: 0;
`

export default () => (
  <Root>
    <Button onClick={login}>login</Button>
  </Root>
)
