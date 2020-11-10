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
  deflection: 'not recieved',
  acceleration: 'not received',
}

export default ({ loggedIn }) => {
  const [{ environment, deflection, acceleration }, setStatus] = useState(
    initialStatus
  )

  useMessage(({ type }) => {
    const date = new Date(Date.now())
    setStatus((status) => ({
      ...status,
      [type]: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    }))
  })

  return (
    !!loggedIn && (
      <Menu className="card">
        <div>
          <SelectDevice />
        </div>
        <div>
          <p className="text-sm">last environmental reading: {environment}</p>
          <p className="text-sm">last deflection reading: {deflection}</p>
          <p className="text-sm">last acceleration event: {acceleration}</p>
        </div>
      </Menu>
    )
  )
}
