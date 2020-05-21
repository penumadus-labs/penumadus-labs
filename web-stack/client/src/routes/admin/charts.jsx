import React from 'react'
import LineChart from '../../components/line-chart'
import Loading from '../../components/loading'
import { useDatabaseState } from '../../hooks/use-database'
import { filterData } from '../../utils/data'

export default () => {
  const { loading, error, standardData: data } = useDatabaseState()

  if (loading) return <Loading />
  if (error) return null

  // don't render while wating for data
  const keys = ['humidity', 'temperature']
  // const data = parseCSVData(csv)
  console.log(data)
  const humidity = filterData(data, keys[0])
  const tempurature = filterData(data, keys[1])

  return (
    <>
      <LineChart data={humidity} dataKey={keys[0]} />
      <LineChart data={tempurature} dataKey={keys[1]} />
    </>
  )
}
