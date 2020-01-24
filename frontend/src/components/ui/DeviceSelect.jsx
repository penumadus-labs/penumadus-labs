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
  const [{ selected, devices }, dispatch] = useDevicesContext()

  const name = selected ? selected.name : ''

  const handleSelect = ({ target }) => {
    dispatch({ type: 'select', name: target.value })
  }

  return (
    <Root>
      <p>select device:</p>
      <Select selected={name} options={devices} handleSelect={handleSelect} />
    </Root>
  )
}
