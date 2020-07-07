import React from 'react'
import Chart from '../components/charts/d3/chart'
import useDatabase from '../context/database/context'
import Loading from '../components/loading'

export default () => {
  const [{ loading, error, standard }] = useDatabase()

  if (error) return <p className="card error">error</p>
  if (loading) return <Loading />

  return (
    <>
      <Chart data={standard} />
    </>
  )
}
