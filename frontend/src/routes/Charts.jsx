import React from 'react'
import LineChart from '../components/LineChart.jsx'
import useCsv, { filter } from '../hooks/use-csv'

export default () => {
  const data = useCsv('/data.csv')

  if (data) {
    const hum = filter(data, 'hum')
    const temp = filter(data, 'temp')

    return (
      <>
        <LineChart data={hum} dataKey='humidity' />
        <LineChart data={temp} dataKey='temperature' />
      </>
    )
  }
  return null
}
