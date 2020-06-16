const { Router } = require('express')
const { getDeviceData } = require('../controllers/database')

const database = Router()

const filterStandard = (data) => {
  const test = (val, limit) => val < limit - range || limit + range < val

  const humdityLimit = 45
  const temperatureLimit = 30
  const pressureLimit = 0
  const range = 1

  return data.filter(({ humidity, temperature, pressure, time }) => {
    return (
      test(humidity, humdityLimit) ||
      test(temperature, temperatureLimit) ||
      test(pressure, pressureLimit)
    )
  }, [])
}

const filterAcceleration = (data) => {
  const test = (val) => val < limit - range || limit + range < val

  const xLimit = 6.5
  const yLimit = 6.2
  const zLimit = 6.7

  const limit = 6.3
  const range = 5

  return data.filter(({ x, y, z, time }) => {
    return test(x) || test(y) || test(z)
  }, [])
}

const filterAccelerationEvents = (data) => {
  let prev = { time: 0 }

  return data
    .filter((point) => {
      const res = point.time - 0.01 >= prev.time
      prev = point
      return res
    })
    .map((point) => ({ time: point.time, y: 0.5 }))
}

database.get('/device-data', async ({ query }, res) => {
  try {
    const { standard, acceleration } = await getDeviceData(query.id)

    const filteredStandard = filterStandard(standard)
    const filteredAcceleration = filterAcceleration(acceleration)
    const events = filterAccelerationEvents(acceleration)

    const vals = res.send({
      standard: filteredStandard,
      acceleration: filteredAcceleration,
      events,
    })
  } catch (error) {
    console.error(error)
  }
})

module.exports = database
