const { Router } = require('express')
const handleAsync = require('./handle-async')
const { commands, setters } = require('../utils/tcp-protocol')
const {
  getDeviceSettings,
  sendDeviceCommand,
} = require('../controllers/channel')

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

module.exports = devices
