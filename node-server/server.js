const express = require('express')
const cors = require('cors')
const apiRouter = require('./api/routes')
const { dbClientConnect } = require('./db/client')
const { tcpClientConnect } = require('./sockets')
const { resolve } = require('path')
const listen = require('./utils/http')

const development = process.env.NODE_ENV === 'development'
const port = 8080
const appPath = '../frontend/build/'
const indexPath = resolve(appPath + 'index.html')

const app = express()

if (development) app.use(cors())

app.use(express.static(appPath))

app.use('/api', apiRouter)

app.get('*', (req, res) => {
  if (!req.xhr) res.sendFile(indexPath)
  else res.sendStatus(404)
})

void (async () => {
  await Promise.all([dbClientConnect(), tcpClientConnect()])

  await listen(app, port)
})().catch(e => {
  console.error(e)
})
