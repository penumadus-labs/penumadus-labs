import React from 'react'
import styled from 'styled-components'
import Select from './select'
import useDatabaseContext from '../../hooks/use-database-context'

const Root = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`

export default () => {
  const [{ selected, devices }, { selectDevice }] = useDatabaseContext()

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
