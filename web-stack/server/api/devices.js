const { Router } = require('express')
const handleAsync = require('./handle-async')
const { commands, setters, dummySettings } = require('../utils/tcp-protocol')

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
      res.send(
        process.env.amazon ? await getDeviceSettings(query.id) : dummySettings
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
