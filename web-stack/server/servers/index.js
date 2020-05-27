const startWebServer = require('./web')
const startTCPServer = require('./tcp')

module.exports = ({ expressApp, webPort, tcpPort }) => {
  return Promise.all([
    // startWebServer(expressApp, webPort),
    startTCPServer(tcpPort),
  ])
}
