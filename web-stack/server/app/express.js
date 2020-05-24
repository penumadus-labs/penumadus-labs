const express = require('express')
const { resolve } = require('path')
const cors = require('cors')
const apiRouter = require('../api/routes')

const appPath = __dirname + '../../../client/build/'

const staticDir = resolve(appPath)
const appIndex = resolve(appPath + 'index.html')

const app = express()

if (process.env.DEV) app.use(cors())

app.use((req, res, next) => {
  next()
})

app.use('/api', express.json(), apiRouter)

app.use(express.static(staticDir))

app.get('*', (req, res) => {
  if (!req.xhr) res.sendFile(appIndex)
  else res.sendStatus(404)
})

module.exports = app
