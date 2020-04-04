import React from 'react'
import styled from 'styled-components'
import DeviceSelect from '../components/ui/device-select'
import Download from '../components/ui/download'

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
