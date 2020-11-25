const net = require('net')
const Device = require('../controllers/device')

const tcpServer = net.createServer()

tcpServer.on('connection', (socket) => {
  console.info('udp engine connected')
  new Device(socket)
})

module.exports = (port) => {
  return new Promise((_, reject) => {
    tcpServer
      .listen(port, () => {
        console.info(`tcp server listening on port ${port}`)
      })
      .on('error', reject)
  })
} // start tcp server
