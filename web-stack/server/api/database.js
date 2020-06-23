const { Router } = require('express')
const { getDeviceData } = require('../controllers/database')
const { filterData } = require('../utils/filter-data')
const { writeFileSync } = require('fs')

const database = Router()

database.get('/device-data', async ({ query }, res) => {
  try {
    const data = await getDeviceData(query.id)

    // writeFileSync('data.json', JSON.stringify(data.humidity))
    // console.log('written')

    const humidity = filterData('humidity', data.humidity)
    const temperature = filterData('temperature', data.temperature)
    const pressure = filterData('temperature', data.pressure)

    const x = filterData('humidity', data.x)
    const y = filterData('temperature', data.y)
    const z = filterData('temperature', data.z)
    const magnitude = filterData('temperature', data.magnitude)

    const filtered = {
      standard: {
        humidity,
        temperature,
        pressure,
      },
      acceleration: {
        x,
        y,
        z,
        magnitude,
      },
    }

    res.send(filtered)
  } catch (error) {
    console.error(error)
  }
})

module.exports = database
