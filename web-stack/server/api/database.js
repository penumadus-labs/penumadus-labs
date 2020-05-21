const { Router } = require('express')
const { getDeviceData } = require('../controllers/database')

const database = Router()

// database.use(() => {
//   console.log('hi')
// })

database.get('/device-data', async (req, res) => {
  try {
    console.log(req.params)
    // const device = await getDeviceData(id)
    res.send({})
  } catch (error) {
    console.error(error)
  }
})

module.exports = database
