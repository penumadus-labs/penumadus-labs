import React from 'react'
import styled from 'styled-components'
import Button from '../components/ui/button'
import theme from '../style/theme'

const Root = styled.div`
  ${theme.mixins.card};
  margin-right: 0;
  margin-left: 0;
`

export default ({ handleLogin }) => (
  <Root>
    <Button onClick={handleLogin}>login</Button>
  </Root>
)
