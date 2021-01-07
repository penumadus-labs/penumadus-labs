const { join } = require('path')
const development = process.env.NODE_ENV === 'development'

const clientPath = join(__dirname, '..', 'client')

require('dotenv').config({ path: join(clientPath, '.env') }) // MOUNT_PATH

require('dotenv').config({ path: join(__dirname, '.env.local') })
if (!development)
  require('dotenv').config({ path: join(__dirname, '.env.production') }) // COMPILE_MODE

require('./utils/extend')

const database = require('./database/client')
const startUdpEngines = require('./commands/udp-engine')
const app = require('./app')
const startServers = require('./servers')

const webPort = development ? 8080 : 8000
const tcpPort = 32100

void (async () => {
  await database.connect()
  await startUdpEngines({ tcpPort })
  await startServers({ app, webPort, tcpPort })
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
