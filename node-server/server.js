const express = require('express')
const cors = require('cors')
const createApi = require('./api/routes')
const connectToMongo = require('./db/connect')
const { createWebSocketServer, createTCPClient } = require('./sockets')
const { join, resolve } = require('path')

const development = process.env.NODE_ENV === 'development'
const port = 8080

const app = express()

// allow requests from development server in development mode
// serve static app in production
if (development) app.use(cors())
else {
  const appPath = '../frontend/build/'
  app.use(express.static(appPath))
  app.get('*', (req, res) => {
    res.sendFile(resolve(appPath + 'index.html'))
  })
}

const server = createWebSocketServer(app)

void (async () => {
  // await connection to database then pass client context object into api routes
  // const client = await connectToMongo()

  app.use('/api', createApi((await connectToMongo()).db('test')))
  // await createTCPClient()

  server
    .listen(port, () => {
      console.log(`server listenning on port ${port}`)
    })
    .on('error', console.error)
})().catch(console.error)
