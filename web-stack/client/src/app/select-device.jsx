import styled from '@emotion/styled'
import React from 'react'
import useApi from '../api'
import Select from './select'

const Root = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: var(--sm);
  }
`

// const formatDevice = ({ id, deviceType }) => `${id} (${deviceType})`

export default () => {
  const [
    {
      device,
      devices: [, devices],
    },
    { setDevice },
  ] = useApi()

  const handleSelect = (value) => {
    localStorage.setItem('id', value)
    setDevice(devices[value])
  }

  if (!devices) return null

  // if (!devices.length)
  //   return (
  //     <Root>
  //       <p>no devices registered</p>
  //     </Root>
  //   )

  return (
    <Root>
      <p>select device:</p>
      <Select
        selected={device.id}
        options={devices.list.map(({ id }) => id)}
        onSelect={handleSelect}
      />
    </Root>
  )
}
