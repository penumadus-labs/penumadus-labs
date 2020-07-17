import React, { useState } from 'react'
import styled from '@emotion/styled'
import useMessage from '../context/socket/context'

const Menu = styled.div`
  /* / */
`

const initialStatus = {
  standard: 'not recieved',
  acceleration: 'not recieved',
}

export default ({ loggedIn }) => {
  const [{ standard, acceleration }, setStatus] = useState(initialStatus)

  useMessage(({ type }) => {
    const date = new Date(Date.now())

    switch (type) {
      case 'standard':
        setStatus((status) => ({
          ...status,
          standard: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        }))
        break
      case 'acceleration':
        setStatus((status) => ({
          ...status,
          acceleration: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        }))
        break
      default:
        throw new Error('socket sent invalid action type')
    }
  })
  // const devices = ['unit_3', 'unit_2', 'unit_1']
  // const [selected, setSelected] = useState(devices[0])
  // const handleSelect = ({ target }) => {
  //   setSelected(target.value)
  // }

  return loggedIn ? (
    <Menu className="card">
      <p>last data packet: {standard}</p>
      <p>last acceleration packet: {acceleration}</p>
    </Menu>
  ) : null
}
