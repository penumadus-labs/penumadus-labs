const net = require('net')
const createDevice = require('../controllers/device')

const handleConnection = async (socket) => {
  console.info('udp engine connected')

  try {
    const device = await createDevice(socket)
  } catch (error) {
    console.error(error)
  }
}

const tcpServer = net.createServer()

tcpServer.on('connection', handleConnection)

const start = (port) => {
  return new Promise((_, reject) => {
    tcpServer
      .listen(port, () => {
        console.info(`tcp server listening on port ${port}`)
      })
      .on('error', reject)
  })
}

module.exports = start
