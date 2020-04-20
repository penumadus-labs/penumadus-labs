const startWebServer = require('./web')
const startTcpServer = require('./tcp')

module.exports = ({ expressApp, webPort, tcpPort }) => {
  return Promise.all([
    startWebServer(expressApp, webPort),
    startTcpServer(tcpPort),
  ])
}
