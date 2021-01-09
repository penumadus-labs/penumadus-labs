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
      return process.env.LOCAL_SERVER
        ? testSettings
        : await getDeviceSettings(id)
    })
  )
  .post(
    '/command',
    handlePost((body) => {
      if (!process.env.LOCAL_SERVER) return sendDeviceCommand(body)
    })
  )
