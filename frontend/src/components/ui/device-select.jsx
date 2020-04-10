import React from 'react'
import styled from 'styled-components'
import Select from './select'

const Root = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`

export default ({ selected, devices, selectDevice }) => {
  const SelectProps = {
    select: selected.name,
    options: devices.map(({ name }) => name),
    handleSelect({ target }) {
      selectDevice(target.value)
    },
  }
  return (
    <Root>
      <p>select device:</p>
      <Select {...SelectProps} />
    </Root>
  )
}
