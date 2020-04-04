import React from 'react'
import styled from 'styled-components'
import Button from '../components/ui/Button.jsx'
import { login } from '../utils/auth'
import theme from '../style/theme'
// import useTheme from '../utils/use-theme'

const Root = styled.div`
  ${theme.mixins.card};
  margin-right: 0;
  margin-left: 0;
`

export default () => (
  <Root>
    <Button onClick={login}>login</Button>
  </Root>
)
