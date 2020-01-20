import React from 'react'
import styled from 'styled-components'
import Card from '../components/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { login } from '../utils/auth'

const Root = styled.div`
  ${({ theme }) => theme.mixins.card}
  margin-right: 0;
  margin-left: 0;
`

export default () => (
  <Root>
    <Button onClick={login}>login</Button>
  </Root>
)
