import React from 'react'
import styled from 'styled-components'
import DeviceSelect from '../components/ui/DeviceSelect.jsx'
import Download from '../components/ui/Download.jsx'

const Root = styled.div`
  ${({ theme }) => theme.mixins.card}
  display: flex;
  justify-content: space-between;
`

export default () => (
  <Root>
    <DeviceSelect />
    <Download />
  </Root>
)
