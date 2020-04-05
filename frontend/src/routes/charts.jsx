import React from 'react'
import LineChart from '../components/line-chart'
import { useDatabaseContextState } from '../hooks/use-database-context'
import { filterData } from '../utils/data'

export default () => {
  const keys = ['hum', 'temp']

  const {
    selected: { data },
  } = useDatabaseContextState()

  // don't render while wating for data
  console.log(data)
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
