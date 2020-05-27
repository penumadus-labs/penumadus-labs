import React from 'react'
import PressureChart from '../components/charts/pressure'
import AccelerationChart from '../components/charts/acceleration'
import TemperatureAndHumidity from '../components/charts/temperature-humidity'
import useDatabase from '../context/database/context'
import Loading from '../components/loading'

export default () => {
  const [
    { loading, error, acceleration, pressure, temperatureAndHumidity },
  ] = useDatabase()

  if (error) return <p className="card error">error</p>
  if (loading) return <Loading />

  return (
    <div className="grid-2">
      <AccelerationChart data={acceleration} />
      <TemperatureAndHumidity data={temperatureAndHumidity} />
      <PressureChart data={pressure} />
    </div>
  )
}
