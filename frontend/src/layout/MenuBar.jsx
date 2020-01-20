import React from 'react'
import styled from 'styled-components'
import Dropdown from '../components/ui/Dropdown.jsx'
import Download from '../components/ui/Download.jsx'

const Root = styled.div`
  ${({ theme }) => theme.mixins.card}
  display: flex;
  justify-content: space-between;
`

export default () => (
  <Root>
    <Dropdown />
    <Download />
  </Root>
)
