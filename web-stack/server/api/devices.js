const { Router } = require('express')
const handleAsync = require('./handle-async')
const testSettings = require('../protocols/test-settings-tank')
const deviceProtocols = require('../protocols')

const {
  getDeviceSettings,
  sendDeviceCommand,
} = require('../controllers/broadcaster')
const { commands } = require('../protocols/tank')

module.exports = Router()
  .get('/protocol', ({ query: { deviceType } }, res) => {
    const { commands, setters, streams } = deviceProtocols[deviceType]
    res.send({ commands, setters, streams })
  })
  .get(
    '/settings',
    handleAsync(async ({ query }, res) => {
      res.send(
        process.env.AWS_SERVER
          ? await getDeviceSettings(query.id)
          : testSettings
      )
    })
  )
  .post(
    '/command',
    handleAsync(async ({ body }, res) => {
      await sendDeviceCommand(body)
      res.sendStatus(200)
    })
  )
