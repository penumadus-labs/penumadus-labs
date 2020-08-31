const { Router } = require('express')
const { unparse } = require('papaparse')
const { writeFileSync } = require('fs')
const handleAsync = require('./handle-async')
const client = require('../database/client')
const {
  filterData,
  filterStandard,
  filterAcceleration,
} = require('../utils/filter-data')

const database = Router()

database
  .get(
    '/device-list',
    handleAsync(async (req, res) => {
      const data = await client.getDeviceList()
      const response = data.map(({ id }) => id)
      res.send(response)
    })
  )
  .get(
    '/standard-data',
    handleAsync(async ({ query }, res) => {
      const standard = await client.getStandardData(query)
      res.send(standard)
    })
  )
  .get(
    '/standard-csv',
    handleAsync(async ({ query }, res) => {
      const data = await client.getStandardAsList(query)
      const csv = unparse(data)
      res.send(csv)
    })
  )
  .get(
    '/acceleration-events',
    handleAsync(async ({ query }, res) => {
      const accelerationEventTimes = await client.getAccelerationEventTimes(
        query
      )
      res.send(accelerationEventTimes)
    })
  )
  .get(
    '/acceleration-data',
    handleAsync(async ({ query }, res) => {
      const acceleration = await client.getAccelerationEventData(query)
      res.send(acceleration)
    })
  )
  .get(
    '/acceleration-csv',
    handleAsync(async ({ query }, res) => {
      const data = await client.getAccelerationAsList(query)
      const csv = unparse(data)
      res.send(csv)
    })
  )

module.exports = database
