const { Router } = require('express')
const handleAsync = require('./handle-async')
const { commands, setters } = require('../utils/tcp-protocol')
const {
  getDeviceSettings,
  sendDeviceCommand,
} = require('../controllers/channel')

module.exports = Router()
  .get('/protocol', (_, res) => {
    res.send({ commands, setters })
  })
  .get(
    '/settings',
    handleAsync(async ({ query }, res) => {
      res.send(await getDeviceSettings(query.id))
    })
  )
  .post(
    '/command',
    handleAsync(async ({ body }, res) => {
      await sendDeviceCommand(body)
      res.sendStatus(200)
    })
  )
