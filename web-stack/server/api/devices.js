const { Router } = require('express')

const devices = Router()

devices
  .get('/protocol', async (req, res) => {
    res.sendStatus(200)
  })
  .get('/settings', async (req, res) => {
    res.sendStatus(200)
  })
devices.post('/command', async (req, res) => {
  console.log('command')
  try {
    await new Promise((resolve, reject) => setTimeout(resolve, 500))
    res.sendStatus(200)
  } catch (error) {
    res.statusMessage = 'Uh oh!'
    res.sendStatus(400)
    console.error(error)
  }
})

module.exports = devices
