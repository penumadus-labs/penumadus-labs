import React from 'react'
import LineChart from '../../components/line-chart'
import Loading from '../../components/loading'
import { useDatabaseState } from '../../hooks/use-database'
import { filterData } from '../../utils/data'

export default () => {
  const { error, data } = useDatabaseState()

  if (error) return null

  // don't render while wating for data
  console.log(data)
  if (data) {
    const keys = ['humidity', 'temperature']
    // const data = parseCSVData(csv)
    const humidity = filterData(data, keys[0])
    const tempurature = filterData(data, keys[1])

    return (
      <>
        <LineChart data={humidity} dataKey={keys[0]} />
        <LineChart data={tempurature} dataKey={keys[1]} />
      </>
    )
  }
  return <Loading />
}
