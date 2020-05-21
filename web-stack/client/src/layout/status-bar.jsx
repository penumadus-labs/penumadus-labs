import React, { useState } from 'react'
import styled from 'styled-components'
import DeviceSelect from '../components/ui/device-select'
import Download from '../components/ui/download'

const Root = styled.div`
  ${({ theme }) => theme.mixins.card}
`

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
`

const Status = styled.p`
  padding-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ error, theme }) => (error ? theme.color.red : 'inherit')};
  font-size: ${({ theme }) => theme.font.size.link};
`

export default () => {
  const devices = [1, 2, 3]
  const [selected, setSelected] = useState(devices[0])

  const handleSelect = ({ target }) => {
    setSelected(target.value)
  }

  return (
    <Root>
      <Menu>
        <DeviceSelect {...{ options: devices, selected, handleSelect }} />
        <Download />
      </Menu>
      <Status>status test</Status>
    </Root>
  )
}
