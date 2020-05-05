const net = require('net')
const Device = require('../controllers/device')
const tunnel = require('../utils/ssh-tunnel')

const handleConnection = async (socket) => {
  console.log('tcp client connected')

  try {
    const device = new Device(socket)
    await device.initialize()
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
        console.log(`tcp server listening on port ${port}`)
      })
      .on('error', reject)
  })
}

module.exports = start
