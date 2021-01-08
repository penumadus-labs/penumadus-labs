const { Router } = require('express')
const { handleAsync, handleQuery, handlePost } = require('./route-decorators')
const testSettings = require('../protocols/test-settings-tank')
const deviceProtocols = require('../protocols')

const {
  getDeviceSettings,
  sendDeviceCommand,
} = require('../controllers/broadcaster')

module.exports = Router()
  .get(
    '/protocol',
    handleQuery(({ deviceType }) => {
      const { commands, setters, streams } = deviceProtocols[deviceType]
      return { commands, setters, streams }
    })
  )
  .get(
    '/settings',
    handleQuery(async ({ id }) => {
      return process.env.AWS_SERVER ? await getDeviceSettings(id) : testSettings
    })
  )
  .post(
    '/command',
    handlePost((body) => {
      if (process.env.AWS_SERVER) return sendDeviceCommand(body)
    })
  )
