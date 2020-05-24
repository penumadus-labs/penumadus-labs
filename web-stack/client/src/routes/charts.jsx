import React from 'react'
import LineChart from '../components/line-chart'
import useDatabase from '../context/database/context'
import { filterData } from '../utils/data'

export default () => {
  const [
    { loading, error, standardData: sd, accelerationData: ad },
  ] = useDatabase()

  if (loading) return <p className='card'>loading...</p>
  if (error) return <p className='card error'>error</p>

  // don't render while wating for data
  const keys = ['humidity', 'temperature', 'magnitude']
  // const data = parseCSVData(csv)
  console.log('standard data', sd)
  console.log('acceleration data', ad)
  const humidity = filterData(sd, keys[0])
  const mag = filterData(ad, keys[2])

  return (
    <div className='flex-2'>
      <LineChart data={humidity} dataKey={keys[0]} />
      <LineChart data={mag} dataKey={keys[2]} />
    </div>
  )
}
