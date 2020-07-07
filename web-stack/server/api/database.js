const { Router } = require('express')
const { getDeviceData } = require('../controllers/database')
const {
  filterData,
  filterStandard,
  filterAcceleration,
} = require('../utils/filter-data')
const { writeFileSync } = require('fs')

const formatTimes = (data, key) => {
  for (const point of data) {
    const date = new Date(point.time * 1000)
    point.time = `${date.getHours()}:${date.getMinutes()}`
  }
}

const database = Router()

database.get('/device-data', async ({ query }, res) => {
  try {
    const {
      humidity,
      temperature,
      pressure,
      x,
      y,
      z,
      magnitude,
    } = await getDeviceData(query.id)

    const data = {
      standard: {
        humidity,
        temperature,
        pressure,
      },
      // acceleration: {
      //   x,
      //   y,
      //   z,
      //   magnitude,
      // },
    }

    res.send(data)
  } catch (error) {
    console.error(error)
  }
})

module.exports = database
