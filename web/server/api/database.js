const { Router, query } = require('express')
const {
  handleAsync,
  handleQuery,
  handleDownload,
} = require('./route-decorators')
const database = require('../database/client')
const createDeviceConfigFile = require('../utils/create-device-config-file')

module.exports = Router()
  .get('/devices', handleQuery(database.getDevices))
  .get(
    '/linear-data',
    handleQuery(({ recent, ...query }) =>
      recent ? database.getDataRecent(query) : database.getDataRange(query)
    )
  )
  .get(
    '/linear-data-csv',
    handleDownload((query) =>
      database.getDataRange({
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
      await database.deleteData(query)
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
