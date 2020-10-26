import styled from '@emotion/styled'
import React, { useState } from 'react'
import useMessage from '../services/socket'
import SelectDevice from './select-device'
const Menu = styled.div`
  display: flex;

  justify-content: space-between;
`

const initialStatus = {
  standard: 'not received',
  acceleration: 'not received',
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

      // throw new Error('socket sent invalid action type')
    }
  })

  return (
    !!loggedIn && (
      <Menu className="card">
        <div>
          <SelectDevice />
        </div>
        <div>
          <p>last data packet: {standard}</p>
          <p>last acceleration event: {acceleration}</p>
        </div>
      </Menu>
    )
  )
}
