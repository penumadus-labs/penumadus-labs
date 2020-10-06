require('dotenv').config({ path: __dirname + '/.env.local' })
require('dotenv').config({ path: __dirname + '/.env' })

const { connect } = require('./database/client')
const startUdpEngines = require('./commands/udp-engine')
const expressApp = require('./app/express')
const startServers = require('./servers')

const webPort = 8080
const tcpPort = 32100

void (async () => {
  await connect()
  // await startUdpEngines({ tcpPort })
  await startServers({ expressApp, webPort, tcpPort })
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
