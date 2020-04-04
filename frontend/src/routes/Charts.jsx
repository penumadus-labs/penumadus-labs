import React from 'react'
import LineChart from '../components/LineChart.jsx'
import { useDevicesState } from '../hooks/use-devices-context'
import { filterData } from '../utils/data'

export default () => {
  const keys = ['hum', 'temp']

  const {
    selected: { data },
  } = useDevicesState()

  // don't render while wating for data
  if (data) {
    // const data = parseCSVData(csv)
    const hum = filterData(data, keys[0])
    const temp = filterData(data, keys[1])

    return (
      <>
        <LineChart data={hum} dataKey={keys[0]} />
        <LineChart data={temp} dataKey={keys[1]} />
      </>
    )
  }
  return null
}
