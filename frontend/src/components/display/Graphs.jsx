import React from 'react'
import LineGraph from './LineGraph.jsx'
import useCsv, { filter } from '../../hooks/use-csv'

export default () => {
  const data = useCsv('/data.csv')

  if (data) {
    const hum = filter(data, 'hum')
    const temp = filter(data, 'temp')

    return (
      <>
        <LineGraph data={hum} dataKey='humidity' />
        <LineGraph data={temp} dataKey='temperature' />
      </>
    )
  }
  return null
}
