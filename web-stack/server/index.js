const { join } = require('path')
require('dotenv').config({ path: join(__dirname, '.env.local') })
require('dotenv').config({ path: join(__dirname, '.env') })
require('dotenv').config({ path: join(__dirname, '..', 'client', '.env') })

const { connect } = require('./database/client')
const startUdpEngines = require('./commands/udp-engine')
const app = require('./app')
const startServers = require('./servers')

const webPort = 8080
const tcpPort = 32100

void (async () => {
  await connect()
  await startUdpEngines({ tcpPort })
  await startServers({ app, webPort, tcpPort })
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
