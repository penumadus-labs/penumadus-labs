const { Router } = require('express')
const { unparse } = require('papaparse')
const client = require('../controllers/database')
const {
  filterData,
  filterStandard,
  filterAcceleration,
} = require('../utils/filter-data')
const { writeFileSync } = require('fs')

const database = Router()

// database.get('start-time', async ({ query }, res) => {
//   const startTime = await getStartTime(query.id)
//   res.send(startTime)
// })

database.get('/device-list', async (req, res) => {
  try {
    const data = await client.getDeviceList()
    const response = data.map(({ id }) => id)

    res.send(response)
  } catch (error) {
    res.sendStatus(500)
  }
})

database.get('/device-standard-data', async ({ query }, res) => {
  try {
    const standard = await client.getStandardAsLists(query)

    standard.pressure = standard.pressure.map((d) => ({
      ...d,
      pressure: Math.floor(d.pressure / 100),
    }))

    res.send(standard)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

database.get('/device-standard-csv', async ({ query }, res) => {
  try {
    const data = await client.getStandardAsList(query)

    const csv = unparse(data)

    res.send(csv)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

database.get('/device-acceleration-data', async ({ query }, res) => {
  try {
    const acceleration = await client.getAccelerationAsLists(query)

    res.send(acceleration)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

database.get('/device-acceleration-csv', async ({ query }, res) => {
  try {
    const data = await client.getAccelerationAsList(query).catch(console.error)

    const csv = unparse(data)

    res.send(csv)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

module.exports = database
