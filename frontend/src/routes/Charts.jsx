import React from 'react'
import LineChart from '../components/LineChart.jsx'
import useCSV, { filter } from '../hooks/use-csv'
import { csv } from '../utils/api'

export default () => {
  const data = useCSV(csv)

  const key1 = 'hum'
  const key2 = 'temp'

  if (data) {
    const hum = filter(data, key1)
    const temp = filter(data, key2)

    return (
      <>
        <LineChart data={hum} dataKey={key1} />
        <LineChart data={temp} dataKey={key2} />
      </>
    )
  }
  return null
}
