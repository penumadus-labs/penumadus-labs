const { Router } = require('express')
const { unparse } = require('papaparse')
const handleAsync = require('./handle-async')
const client = require('../database/client')
const createDeviceConfigFile = require('../utils/create-device-config-file')

module.exports = Router()
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
      const standard = await client.getStandardDataReduced(query)
      res.send(standard)
    })
  )
  .get(
    '/standard-csv',
    handleAsync(async ({ query }, res) => {
      const { data } = await client.getStandardData({ ...query, limit: -1 })
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
      const { data } = await client.getAccelerationEventData(query)
      const csv = unparse(data)
      res.send(csv)
    })
  )
  .delete(
    '/standard',
    handleAsync(async () => {})
  )
  .delete(
    '/acceleration',
    handleAsync(async () => {})
  )
  .post(
    '/register',
    handleAsync(async ({ body }, res) => {
      const port = await client.insertDevice(body)
      const file = createDeviceConfigFile({ ...body, port })
      res.send(file)
    })
  )
