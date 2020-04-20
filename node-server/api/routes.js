const { Router } = require('express')
const { readTest } = require('../db/client')

const api = Router()

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
