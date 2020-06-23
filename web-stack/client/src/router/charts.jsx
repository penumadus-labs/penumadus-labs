import React from 'react'
// import Chart from '../components/charts/vis/line-chart'
import StandardChart from '../components/charts/standard'
import AccelerationChart from '../components/charts/acceleration'
// import AccelerationEventsChart from '../components/charts/acceleration-events'
import useDatabase from '../context/database/context'
import Loading from '../components/loading'

export default () => {
  // console.log(useDatabase())
  const [{ loading, error, standard, acceleration }] = useDatabase()

  console.log(loading)

  if (error) return <p className="card error">error</p>
  if (loading) return <Loading />

  return (
    <>
      {/* <Chart data={temperature} /> */}
      <StandardChart data={standard} />
      <AccelerationChart data={acceleration} />
      {/*<AccelerationEventsChart data={events} /> */}
    </>
  )
}
