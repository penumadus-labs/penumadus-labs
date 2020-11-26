import styled from '@emotion/styled'
import React, { useState, useEffect } from 'react'
import useApi from '../api'
import useMessage from '../services/socket'
import SelectDevice from './select-device'
const Menu = styled.div`
  display: flex;
  align-items: center;

  justify-content: space-between;
`

const formatZeros = (value) => {
  return value < 10 ? `0${value}` : value
}

const getTimeInHoursMinutesSeconds = () => {
  const date = new Date(Date.now())
  const hours = date.getHours()
  const minutes = formatZeros(date.getMinutes())
  const seconds = formatZeros(date.getSeconds())

  return `${hours}:${minutes}:${seconds}`
}

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
    setStatus((status) => ({
      ...status,
      [type]: getTimeInHoursMinutesSeconds(),
    }))
  })

  return (
    <Menu>
      <div>
        <SelectDevice />
      </div>
      <div>
        {Object.entries(status).map(([field, value]) => (
          <p key={field} className="text-sm">
            {field}: {value}
          </p>
        ))}
      </div>
    </Menu>
  )
}
