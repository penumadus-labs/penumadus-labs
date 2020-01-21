import React, { useContext } from 'react'
import styled from 'styled-components'
import Select from './Select.jsx'
import DeviceContext from '../../context/Devices.jsx'

const Root = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`

export default () => {
  // useContext(DeviceContext)

  const list = ['device1', 'device2', 'device3']

  return (
    <Root>
      <p>select device:</p>
      <Select list={list} />
    </Root>
  )
}
