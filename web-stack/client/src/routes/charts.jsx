import React from 'react'
import LineChart from '../components/line-chart'
import { useDatabaseState } from '../hooks/use-database'
import { filterData } from '../utils/data'

export default () => {
  const {
    loading,
    error,
    standardData: sd,
    accelerationData: ad,
  } = useDatabaseState()

  if (loading) return <p>loading</p>
  if (error) return <p>error</p>

  // don't render while wating for data
  const keys = ['humidity', 'temperature', 'magnitude']
  // const data = parseCSVData(csv)
  console.log('standard data', sd)
  console.log('acceleration data', ad)
  const humidity = filterData(sd, keys[0])
  const mag = filterData(ad, keys[2])

  return (
    <>
      <LineChart data={humidity} dataKey={keys[0]} />
      <LineChart data={mag} dataKey={keys[2]} />
    </>
  )
}
