const express = require('express')
const cors = require('cors')
const createApi = require('./api/routes')
const connectToMongo = require('./db/connect')
const createWebsocketServer = require('./sockets/sockets')
const { join, resolve } = require('path')

const development = process.env.NODE_ENV === 'development'
const port = 3000

const app = express()

// allow requests from development server in development mode
// serve static app in production
if (development) app.use(cors())
else app.use(express.static(resolve('../frontend/public')))
// {
//   const appPath = '../../react/frontend/build/'
//   app.get('/callback/*', (req, res) => {
//     res.sendFile(resolve(appPath + 'index.html'))
//   })
//   app.get('/app/*', (req, res) => {
//     res.sendFile(resolve(appPath + 'index.html'))
//   })
// }

const server = createWebsocketServer(app)

void (async () => {
  // await connection to database then pass client context object into api routes
  // const client = await connectToMongo()
  // app.use('/api', createApi(client.db('test')))

  server
    .listen(port, () => {
      console.log(`server listenning on port ${port}`)
    })
    .on('error', console.error)
})().catch(console.error)
