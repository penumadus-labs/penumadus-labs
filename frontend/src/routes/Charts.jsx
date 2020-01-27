import React from 'react'
import LineChart from '../components/LineChart.jsx'
import { useDevicesState } from '../hooks/use-devices-context'
import { parseCSVData, filterParsed } from '../utils/csv'

export default () => {
  const keys = ['hum', 'temp']

  const {
    selected: { csv },
  } = useDevicesState()

  if (csv) {
    const data = parseCSVData(csv)
    const hum = filterParsed(data, keys[0])
    const temp = filterParsed(data, keys[1])

    return (
      <>
        <LineChart data={hum} dataKey={keys[0]} />
        <LineChart data={temp} dataKey={keys[1]} />
      </>
    )
  }
  return null
}
