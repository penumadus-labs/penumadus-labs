const { Router } = require('express')
const { unparse } = require('papaparse')
const handleAsync = require('./handle-async')
const client = require('../database/client')
const createDeviceConfigFile = require('../utils/create-device-config-file')

module.exports = Router()
  .get(
    '/devices',
    handleAsync(async (req, res) => {
      const list = await client.getDeviceList()
      res.send(list.reduce((a, device) => ({ ...a, [device.id]: device }), {}))
    })
  )
  .get(
    '/environment',
    handleAsync(async ({ query }, res) => {
      res.send(await client.getEnvironmentReduced(query))
    })
  )
  .get(
    '/environment-csv',
    handleAsync(async ({ query }, res) => {
      const { data } = await client.getEnvironment({ ...query, limit: -1 })
      const csv = unparse(data)
      res.send(csv)
    })
  )
  .get(
    '/acceleration',
    handleAsync(async ({ query }, res) => {
      res.send(await client.getAcceleration(query))
    })
  )
  .get(
    '/acceleration-event',
    handleAsync(async ({ query }, res) => {
      res.send(await client.getAccelerationEvent(query))
    })
  )
  .get(
    '/acceleration-event-csv',
    handleAsync(async ({ query }, res) => {
      const { data } = await client.getAccelerationEventData(query)
      const csv = unparse(data)
      res.send(csv)
    })
  )
  .delete(
    '/environment',
    handleAsync(async ({ query }, res) => {
      await client.deleteEnvironment(query)
      res.sendStatus(200)
    })
  )
  .delete(
    '/acceleration',
    handleAsync(async ({ query }, res) => {
      await client.deleteAcceleration(query)
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
