const { Router } = require('express')
const { getDeviceData } = require('../controllers/database')

const database = Router()

// database.use(() => {
//   console.log('hi')
// })

database.get('/device-data', async (req, res) => {
  try {
    const data = await getDeviceData(req.query.id)
    res.send(data)
  } catch (error) {
    console.error(error)
  }
})

module.exports = database
