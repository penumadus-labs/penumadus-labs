const { Router } = require('express')
const handleAsync = require('./handle-async')
const { commands, setters } = require('../utils/tcp-protocol')
const {
  getDeviceSettings,
  sendDeviceCommand,
} = require('../controllers/channel')

module.exports = Router()
  .get(
    '/protocol',
    handleAsync(async (req, res) => {
      res.send({ commands, setters })
    })
  )
  .get(
    '/settings',
    handleAsync(async ({ query }, res) => {
      const settings = await getDeviceSettings(query.id)
      res.send(settings)
    })
  )
  .post(
    '/command',
    handleAsync(async ({ body: { id, command, args } }, res) => {
      await sendDeviceCommand(id, command, args)
      res.sendStatus(200)
    })
  )
