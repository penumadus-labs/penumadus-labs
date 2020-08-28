const { Router } = require('express')
const { unparse } = require('papaparse')
const client = require('../database/client')
const {
  filterData,
  filterStandard,
  filterAcceleration,
} = require('../utils/filter-data')
const { writeFileSync } = require('fs')

const database = Router()

const handleAsync = (promise) => async (req, res) => {
  try {
    await promise(req, res)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

// database.get('/device-list', async (req, res) => {
//   try {
//     const data = await client.getDeviceList()
//     const response = data.map(({ id }) => id)

//     res.send(response)
//   } catch (error) {
//     console.error(error)
//     res.sendStatus(500)
//   }
// })

database.get(
  '/device-list',
  handleAsync(async (req, res) => {
    const data = await client.getDeviceList()
    const response = data.map(({ id }) => id)
    res.send(response)
  })
)

database.get(
  '/standard-data',
  handleAsync(async ({ query }, res) => {
    const standard = await client.getStandardData(query)
    res.send(standard)
  })
)

database.get(
  '/standard-csv',
  handleAsync(async ({ query }, res) => {
    const data = await client.getStandardAsList(query)
    const csv = unparse(data)
    res.send(csv)
  })
)

database.get(
  '/acceleration-events',
  handleAsync(async ({ query }, res) => {
    const accelerationEvents = await client.getAccelerationEvents(query)
    res.send(accelerationEvents.reverse())
  })
)

database.get(
  '/acceleration-data',
  handleAsync(async ({ query }, res) => {
    const acceleration = await client.getAccelerationData(query)
    res.send(acceleration)
  })
)

database.get(
  '/acceleration-csv',
  handleAsync(async ({ query }, res) => {
    const data = await client.getAccelerationAsList(query).catch(console.error)
    const csv = unparse(data)
    res.send(csv)
  })
)

module.exports = database
