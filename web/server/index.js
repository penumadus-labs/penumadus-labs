const { join } = require('path')
const development = process.env.NODE_ENV === 'development'

const clientPath = join(__dirname, '..', 'client')

require('dotenv').config({ path: join(clientPath, '.env') })
require('dotenv').config({ path: join(__dirname, '.env.local') })
if (!development)
  require('dotenv').config({ path: join(__dirname, '.env.production') })

require('./utils/extend')

const { connect } = require('./database/client')
const startUdpEngines = require('./commands/udp-engine')
const app = require('./app')
const startServers = require('./servers')

const { REACT_APP_DEVELOPMENT_PORT, REACT_APP_PRODUCTION_PORT } = process.env

const webPort = development
  ? REACT_APP_DEVELOPMENT_PORT
  : REACT_APP_PRODUCTION_PORT
const tcpPort = 32100

void (async () => {
  await connect()
  await startUdpEngines({ tcpPort })
  await startServers({ app, webPort, tcpPort })
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
