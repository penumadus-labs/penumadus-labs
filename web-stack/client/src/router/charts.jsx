import React from 'react'
import ChartControls from '../components/forms/chart-controls'
import AccelerationChart from '../components/charts/acceleration'
import Standard from '../components/charts/standard'
import useDatabase from '../context/database/context'
import Loading from '../components/loading'

export default () => {
  const [{ loading, error, acceleration, standard }] = useDatabase()

  if (error) return <p className="card error">error</p>
  if (loading) return <Loading />

  return (
    <>
      <ChartControls />
      <div className="main">
        <AccelerationChart data={acceleration} />
        <Standard data={standard} />
      </div>
    </>
  )
}
