const express = require('express')
const cors = require('cors')
const createApi = require('./api/routes')
const connectToMongo = require('./db/connect')
const createWebsocketServer = require('./sockets/sockets')

const development = process.env.NODE_ENV === 'development'
const port = 80

const app = express()

// allow requests from development server in development mode
// serve static app in production
if (development) app.use(cors())
else app.use(express.static('../frontend/public'))

const server = createWebsocketServer(app)

void (async () => {
  // await connection to database then pass client context object into api routes
  const client = await connectToMongo()
  app.use('/api', createApi(client.db('test')))

  console.log('trying listen')

  await new Promise((resolve, reject) => {
    server.listen(port, resolve)
  })

  console.log(`server listenning on port ${port}`)
})().catch(console.error)
