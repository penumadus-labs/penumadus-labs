const { Router } = require('express')
const client = require('../controllers/database')
const {
  filterData,
  filterStandard,
  filterAcceleration,
} = require('../utils/filter-data')
const { writeFileSync } = require('fs')

// const formatTimes = (data, key) => {
//   for (const point of data) {
//     const date = new Date(point.time * 1000)
//     point.time = `${date.getHours()}:${date.getMinutes()}`
//   }
// }

const database = Router()

database.get('start-time', async ({ query }, res) => {
  const startTime = await getStartTime(query.id)
  res.send(startTime)
})

database.get('/device-data', async ({ query }, res) => {
  try {
    const data = await client.getDeviceData(query.id)

    res.send(data)
  } catch (error) {
    console.error(error)
  }
})

database.get('/device-standard-data', async ({ query }, res) => {
  try {
    const standard = await client.getStandardData(query)

    res.send(standard)
  } catch (error) {
    console.error(error)
  }
})

module.exports = database
