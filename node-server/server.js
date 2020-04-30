const expressApp = require('./app/express')
const { dbClientConnect } = require('./db/client')
const startServers = require('./servers')

const webPort = 8080
const tcpPort = 32100

void (async () => {
  await dbClientConnect()
  await startServers({ expressApp, webPort, tcpPort })
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
