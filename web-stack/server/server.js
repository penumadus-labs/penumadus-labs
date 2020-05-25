require('dotenv').config({ path: __dirname + '/.env' })

const expressApp = require('./app/express')
const { connect } = require('./controllers/database')
const startServers = require('./servers')

const webPort = 8080
const tcpPort = 32100

void (async () => {
  await connect()
  await startServers({ expressApp, webPort, tcpPort })
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
