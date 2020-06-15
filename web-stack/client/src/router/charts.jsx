import React from 'react'
import ChartControls from '../components/forms/chart-controls'
import StandardChart from '../components/charts/standard'
import AccelerationChart from '../components/charts/acceleration'
import useDatabase from '../context/database/context'
import Loading from '../components/loading'

export default () => {
  const [{ loading, error, standard, acceleration }] = useDatabase()

  if (error) return <p className="card error">error</p>
  if (loading) return <Loading />

  return (
    <>
      <ChartControls />
      <div className="main">
        {/* <StandardChart data={standard} /> */}
        {/* <AccelerationChart data={{}} /> */}
      </div>
    </>
  )
}
