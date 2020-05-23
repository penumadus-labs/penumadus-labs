import React, { useState } from 'react'
import styled from '@emotion/styled'
import DeviceSelect from '../components/ui/device-select'
import Download from '../components/ui/download'

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
`

export default () => {
  const devices = ['unit_3', 'unit_2', 'unit_1']
  const [selected, setSelected] = useState(devices[0])

  const handleSelect = ({ target }) => {
    setSelected(target.value)
  }

  return (
    <div className='card'>
      <Menu>
        <DeviceSelect {...{ options: devices, selected, handleSelect }} />
        <Download />
      </Menu>
      <p>status test</p>
    </div>
  )
}
