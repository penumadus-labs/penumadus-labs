import styled from '@emotion/styled'
import React, { useState } from 'react'
import useMessage from '../services/socket'
import SelectDevice from './select-device'
const Menu = styled.div`
  display: flex;

  justify-content: space-between;
`

const initialStatus = {
  environment: 'not received',
  acceleration: 'not received',
}

export default ({ loggedIn }) => {
  const [{ environment, acceleration }, setStatus] = useState(initialStatus)

  useMessage(({ type }) => {
    const date = new Date(Date.now())

    switch (type) {
      case 'environment':
        setStatus((status) => ({
          ...status,
          environment: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
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
          <p>last data packet: {environment}</p>
          <p>last acceleration event: {acceleration}</p>
        </div>
      </Menu>
    )
  )
}
