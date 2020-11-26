import React from 'react'
import useApi from '../api'
import Select from '../components/select'

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
    setDevice(devices[value])
    localStorage.setItem('id', value)
  }

  if (!devices) return null

  // if (!devices.length)
  //   return (
  //     <Root>
  //       <p>no devices registered</p>
  //     </Root>
  //   )

  return (
    <Select
      label="select device:"
      selected={device.id}
      options={devices.list.map(({ id }) => id)}
      onSelect={handleSelect}
    />
  )
}
