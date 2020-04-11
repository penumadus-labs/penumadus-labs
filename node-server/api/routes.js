const { Router } = require('express')
const { read } = require('../db/client')

const api = Router()

api.get('/test', (req, res) => {
  res.send('api is working!')
})

api.get('/tank', (req, res) => {
  void (async () => {
    const data = await read('environ_data')

    res.json(data)
  })().catch(console.error)
})

module.exports = api
