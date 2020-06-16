import React from 'react'
import StandardChart from '../components/charts/standard'
import AccelerationChart from '../components/charts/acceleration'
import AccelerationEventsChart from '../components/charts/acceleration-events'
import useDatabase from '../context/database/context'
import Loading from '../components/loading'

export default () => {
  const [{ loading, error, standard, acceleration, events }] = useDatabase()

  if (error) return <p className="card error">error</p>
  if (loading) return <Loading />

  return (
    <div className="main">
      <StandardChart data={standard} />
      <AccelerationChart data={acceleration} />
      <AccelerationEventsChart data={events} />
    </div>
  )
}
