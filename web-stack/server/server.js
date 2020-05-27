require('dotenv').config({ path: __dirname + '/.env' })

const expressApp = require('./app/express')
const { connect } = require('./controllers/database')
const startServers = require('./servers')

const webPort = 8080
const tcpPort = 32100

const twoHours = 7200000

void (async () => {
  await connect()
  await startServers({ expressApp, webPort, tcpPort })
  setTimeout(() => process.exit(0), twoHours)
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
