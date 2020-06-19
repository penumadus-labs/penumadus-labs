const { Router } = require('express')
const { getDeviceData } = require('../controllers/database')
const { filterData } = require('../utils/filter-data')
const { writeFileSync } = require('fs')

const database = Router()

database.get('/device-data', async ({ query }, res) => {
  try {
    const data = await getDeviceData(query.id)

    writeFileSync('data.json', JSON.stringify(data.humidity))
    console.log('written')

    const humidity = filterData('humidity', data.humidity)
    const temperature = filterData('temperature', data.temperature)

    res.send({
      humidity,
      temperature,
      tRaw: data.temperature,
    })
  } catch (error) {
    console.error(error)
  }
})

module.exports = database
