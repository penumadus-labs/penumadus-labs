const { join } = require('path')
const development = process.env.NODE_ENV === 'development'

require('dotenv').config({ path: join(__dirname, '.env') })

const { LOCAL_SERVER, SERVER_IP, MODE, AUTH_DISABLED } = process.env

if (!development) {
  if (LOCAL_SERVER)
    console.warn('warning: LOCAL_SERVER environment variables not set')
  if (!MODE) console.warn('warning: runtime mode not set')
  if (AUTH_DISABLED) console.warn('warning: authorization is disabled')
}

if (!LOCAL_SERVER && !SERVER_IP)
  throw new Error('must provide SERVER_IP when on aws server')

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
