const { Router } = require('express')
const {
  handleAsync,
  handleQuery,
  handleDownload,
} = require('./route-decorators')
const database = require('../database/client')
const createDeviceConfigFile = require('../utils/create-device-config-file')

module.exports = Router()
  .get('/devices', handleQuery(database.getDeviceSchemas))
  .get('/linear-data', handleQuery(database.getLinearData))
  .get(
    '/linear-data-csv',
    handleDownload((query) =>
      database.getLinearData({
        ...query,
        limit: null,
      })
    )
  )
  .get('/acceleration', handleQuery(database.getAcceleration))
  .get('/acceleration-event', handleQuery(database.getAccelerationEvent))
  .get('/acceleration-event-csv', handleDownload(database.getAccelerationEvent))
  .delete(
    '/data',
    handleAsync(async ({ query }, res) => {
      await database.deleteField(query)
      res.sendStatus(200)
    })
  )
  .post(
    '/register',
    handleAsync(async ({ body }, res) => {
      const port = await database.insertDevice(body)
      const file = createDeviceConfigFile({ ...body, port })
      res.send(file)
    })
  )
