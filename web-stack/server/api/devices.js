const { Router } = require('express')
const { commands, setters } = require('../utils/tcp-protocol')
const {
  getDeviceSettings,
  sendDeviceCommand,
} = require('../controllers/bridge')

const dummySettings = {
  ip: { ipaddr: '18.222.29.175', ipport: '32159' },
  pressure: {
    psiPreFill: '30',
    psiPostFill: '40',
    fills: '0',
    fillMax: '20',
    fullscale: '100.00',
    excitation: '5.00',
    calFactor: '3.00',
  },
  acceleration: { accelmagthresh: '3.500000' },
  sample: {
    secBetween: '10',
    sampleinterval: '50',
    accelsampint: '5',
  },
}

const devices = Router()

devices
  .get('/protocol', async (req, res) => {
    res.send({ commands, setters })
  })
  .get('/settings', async ({ query }, res) => {
    try {
      const settings = await getDeviceSettings(query.id)
      res.send(settings)
    } catch (error) {}
  })
devices.post('/command', async ({ body: { id, command, args } }, res) => {
  try {
    // await new Promise((resolve, reject) => setTimeout(resolve, 500))
    await sendDeviceCommand(id, command, args)
    res.sendStatus(200)
  } catch (error) {
    res.statusMessage = "Command didn't make it :("
    res.sendStatus(400)
    console.error(error)
  }
})

module.exports = devices
