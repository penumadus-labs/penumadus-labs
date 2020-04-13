const express = require('express')
const cors = require('cors')
const apiRouter = require('./api/routes')
const { dbClientConnect } = require('./db/client')
const { TCPServer, WSServer } = require('./sockets')
const { resolve } = require('path')
// const listen = require('./utils/http')

const development = process.env.NODE_ENV === 'development'
const webPort = 8080
const tcpPort = 8000
const appPath = '../frontend/build/'
const indexPath = resolve(appPath + 'index.html')

const app = express()

if (development) app.use(cors())

app.use(express.static(resolve(appPath)))

// app.use('/api', apiRouter)

app.get('*', (req, res) => {
  if (!req.xhr) res.sendFile(indexPath)
  else res.sendStatus(404)
})

const tcpServer = new TCPServer(tcpPort)
const wsServer = new WSServer(app, webPort)

void (async () => {
  // await dbClientConnect()
  await tcpServer.start()
  wsServer.start()
})().catch(e => {
  console.error(e)
  process.exit(1)
})
