const { Router } = require('express')

const createApi = db => {
  const api = Router()

  api.get('/test', (req, res) => {
    res.send('api is working!')
  })

  api.get('/tank', (req, res) => {
    void (async () => {
      const data = await db
        .collection('environ_data')
        .find()
        .toArray()

      res.json(data)
    })().catch(console.error)
  })

  // api.get('*', (req, res) => {
  //   res.status(404).send('api not resolved')
  // })

  return api
}

module.exports = createApi
