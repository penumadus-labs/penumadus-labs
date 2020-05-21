const { Router } = require('express')
const { readTest } = require('../controllers/database')

const database = Router()

// database.use(() => {
//   console.log('hi')
// })

database.get('/device-data', async (req, res) => {
  try {
    const data = await readTest()
    res.send(data)
  } catch (error) {
    console.error(error)
  }
})

module.exports = database
