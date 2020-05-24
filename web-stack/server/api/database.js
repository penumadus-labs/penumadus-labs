const { Router } = require('express')
const { getDeviceData } = require('../controllers/database')

const database = Router()

database.get('/device-data', async (req, res) => {
  try {
    const data = await getDeviceData(req.query.id)
    const buf = Buffer.from(JSON.stringify(data))
    res.send(buf)
  } catch (error) {
    console.error(error)
  }
})

module.exports = database
