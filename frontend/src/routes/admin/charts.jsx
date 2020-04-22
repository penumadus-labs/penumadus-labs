import React from 'react'
import LineChart from '../../components/line-chart'
import Error from '../../components/error'
import { useDatabaseContextState } from '../../hooks/use-database-context'
import { filterData } from '../../utils/data'

export default () => {
  const {
    selected: {data},
    error,
  } = useDatabaseContextState()

  if (error) return <Error>error: charts not loaded</Error>



  // don't render while wating for data
  if (data) {
    const keys = ['hum', 'temp']
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
