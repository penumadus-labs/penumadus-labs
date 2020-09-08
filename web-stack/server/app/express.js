const express = require('express')
const cookieParser = require('cookie-parser')
const apiRouter = require('../api/routes')

const clientDir = `${__dirname}/../../../client/build/`
const clientIndex = clientDir + 'index.html'

const app = express()

app.use(cookieParser())

app.use((req, _, next) => {
  next()
})

app.use('/api', express.json(), apiRouter)

app.use(express.static(clientDir))

app.get('*', (req, res) => {
  if (!req.xhr) res.sendFile(clientIndex)
  else res.sendStatus(404)
})

module.exports = app
