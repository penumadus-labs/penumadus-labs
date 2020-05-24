const { Router } = require('express')
const { commands, setters } = require('../utils/tcp-protocol')

const devices = Router()

devices
  .get('/protocol', async (req, res) => {
    res.send({ commands, setters })
  })
  .get('/settings', async (req, res) => {
    res.sendStatus(200)
  })
devices.post('/command', async ({ body }, res) => {
  console.log(body)
  try {
    await new Promise((resolve, reject) => setTimeout(resolve, 500))
    res.sendStatus(200)
  } catch (error) {
    res.statusMessage = "Command didn't make it :("
    res.sendStatus(400)
    console.error(error)
  }
})

module.exports = devices
