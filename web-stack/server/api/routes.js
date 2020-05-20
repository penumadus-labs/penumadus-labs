const { Router } = require('express')
const authRouter = require('./auth')
const { readTest } = require('../controllers/database')

const api = Router()

api.use('/auth', authRouter)

api.get('/test', (req, res) => {
  res.send('api is working!')
})

api.get('/tank', async (req, res) => {
  try {
    const data = await readTest()

    res.json(data)
  } catch (e) {
    console.error(e)
  }
})

module.exports = api
