const webServer = require('./web')
const tcpServer = require('./tcp')

module.exports = ({ expressApp, webPort, tcpPort }) =>
  Promise.all([webServer(expressApp, webPort), tcpServer(tcpPort)])
