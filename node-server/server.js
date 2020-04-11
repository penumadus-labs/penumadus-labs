const express = require('express')
const cors = require('cors')
const apiRouter = require('./api/routes')
const { dbClientConnect } = require('./db/client')
const { createWebSocketServer, createTCPClient } = require('./sockets')
const { join, resolve } = require('path')

const development = process.env.NODE_ENV === 'development'
const port = 8080

const app = express()
const server = createWebSocketServer(app)

app.use(cors())

const appPath = '../frontend/build/'
const indexPath = resolve(appPath + 'index.html')
app.use(express.static(appPath))

void (async () => {
  // await connection to database then pass client context object into api routes
  // const client = await connectToMongo()

  await dbClientConnect()
  await createTCPClient()
  app.use('/api', apiRouter)

  app.get('*', (req, res) => {
    if (!req.xhr) res.sendFile(indexPath)
    else res.sendStatus(404)
  })

  server
    .listen(port, () => {
      console.log(`server listening on port ${port}`)
    })
    .on('error', console.error)
})().catch(e => {
  console.error(e)
})
