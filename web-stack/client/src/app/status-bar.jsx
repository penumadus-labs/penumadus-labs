import styled from '@emotion/styled'
import React, { useState, useEffect } from 'react'
import useApi from '../api'
import useMessage from '../services/socket'
import SelectDevice from './select-device'
const Menu = styled.div`
  display: flex;

  justify-content: space-between;
`

const reduceFields = (fields) =>
  fields.reduce((o, field) => ({ ...o, [field]: 'not received' }), {})

export default () => {
  const [
    {
      device: { id, dataFields },
    },
  ] = useApi()
  const [status, setStatus] = useState(reduceFields(dataFields))

  useEffect(() => {
    setStatus(reduceFields(dataFields))
  }, [id, dataFields])

  useMessage(({ type }) => {
    const date = new Date(Date.now())
    setStatus((status) => ({
      ...status,
      [type]: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    }))
  })

  return (
    <Menu className="card">
      <div>
        <SelectDevice />
      </div>
      <div>
        {Object.entries(status).map(([field, value]) => (
          <p key={field} className="text-sm">
            last {field} reading: {value}
          </p>
        ))}
      </div>
    </Menu>
  )
}
