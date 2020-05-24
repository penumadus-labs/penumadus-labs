import React from 'react'
import PressureChart from '../components/charts/pressure'
import AccelerationChart from '../components/charts/acceleration'
import TemperatureAndHumidity from '../components/charts/temperature-humidity'
import useDatabase from '../context/database/context'

export default () => {
  const [
    { loading, error, acceleration, pressure, temperatureAndHumidity },
  ] = useDatabase()

  if (loading) return <p className="card loading">loading...</p>
  if (error) return <p className="card error">error</p>

  return (
    <div className="flex-2">
      <AccelerationChart data={acceleration} />
      <PressureChart data={pressure} />
      <TemperatureAndHumidity data={temperatureAndHumidity} />
    </div>
  )
}
