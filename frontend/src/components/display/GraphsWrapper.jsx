import React from 'react'
import LineGraph from './LineGraph.jsx'
import useCsv, { filter } from '../../utils/use-csv'

export default () => {
  const data = useCsv('/data.csv')

  if (data) {
    const hum = filter(data, 'hum')
    const temp = filter(data, 'temp')

    return (
      <>
        <LineGraph data={hum} dataKey='hum' />
        <LineGraph data={temp} dataKey='temp' />
      </>
    )
  }
  return null
}
