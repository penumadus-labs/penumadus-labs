const startWebServer = require('./web')
const startTcpServer = require('./tcp')

module.exports = ({ expressApp, webPort, tcpPort }) =>
  Promise.all([startWebServer(expressApp, webPort), startTcpServer(tcpPort)])
