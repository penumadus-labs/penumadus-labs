const { Router } = require('express')

const createApi = db => {
  const api = Router()

  api.get('*', (req, res) => {
    void (async () => {
      const data = await db
        .collection('environ_data')
        .find()
        .toArray()

      res.json(data)
    })().catch(console.error)
  })

  return api
}

module.exports = createApi
