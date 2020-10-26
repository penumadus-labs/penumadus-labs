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
      res.send(await client.getStandardDataReduced(query))
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
      res.send(await client.getAccelerationEvents(query))
    })
  )
  .get(
    '/acceleration-event',
    handleAsync(async ({ query }, res) => {
      res.send(await client.getAccelerationEvent(query))
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
    handleAsync(async ({ query }, res) => {
      await client.deleteStandardData(query)
      res.sendStatus(200)
    })
  )
  .delete(
    '/acceleration',
    handleAsync(async ({ query }, res) => {
      await client.deleteAccelerationEvents(query)
      res.sendStatus(200)
    })
  )
  .post(
    '/register',
    handleAsync(async ({ body }, res) => {
      const port = await client.insertDevice(body)
      const file = createDeviceConfigFile({ ...body, port })
      res.send(file)
    })
  )
