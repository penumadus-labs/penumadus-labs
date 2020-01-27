import React from 'react'
import styled from 'styled-components'
import Select from './Select.jsx'
import useDevicesContext from '../../hooks/use-devices-context'

const Root = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`

export default () => {
  const [{ selected, devices }, { selectDevice }] = useDevicesContext()

  const name = selected ? selected.name : ''

  const deviceNames = devices.map(({ name }) => name)

  const handleSelect = ({ target }) => {
    selectDevice(target.value)
  }

  return (
    <Root>
      <p>select device:</p>
      <Select
        selected={name}
        options={deviceNames}
        handleSelect={handleSelect}
      />
    </Root>
  )
}
