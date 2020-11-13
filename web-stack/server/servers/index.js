const startWebServer = require('./web')
const startTCPServer = require('./tcp')

module.exports = ({ app, webPort, tcpPort }) => {
  return Promise.all([startWebServer(app, webPort), startTCPServer(tcpPort)])
}
