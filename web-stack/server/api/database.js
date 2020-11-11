const { Router } = require('express')
const { unparse } = require('papaparse')
const handleAsync = require('./handle-async')
const client = require('../database/client')
const createDeviceConfigFile = require('../utils/create-device-config-file')

module.exports = Router()
  .get(
    '/devices',
    handleAsync(async (req, res) => {
      const list = await client.getDeviceSchemas()
      res.send(
        list.reduce((o, device) => ({ ...o, [device.id]: device }), { list })
      )
    })
  )
  .get(
    '/linear-data',
    handleAsync(async ({ query }, res) => {
      res.send(await client.getLinearData(query))
    })
  )
  .get(
    '/linear-data-csv',
    handleAsync(async ({ query }, res) => {
      const { data } = await client.getLinearData({
        ...query,
        limit: -1,
      })
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
    '/data',
    handleAsync(async ({ req }, res) => {
      await client.deleteField(query)
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
