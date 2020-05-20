const express = require('express')
const cors = require('cors')
const { resolve } = require('path')
const apiRouter = require('../api/routes')

const appPath = '../client/build/'
const indexPath = resolve(appPath + 'index.html')

const app = express()

if (process.env.DEV) app.use(cors())

app.use(express.static(resolve(appPath)))

app.use('/api', apiRouter)

app.get('*', (req, res) => {
  if (!req.xhr) res.sendFile(indexPath)
  else res.sendStatus(404)
})

module.exports = app
