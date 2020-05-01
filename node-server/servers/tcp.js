const { createServer } = require('net')
const controller = require('./controller')
const Device = require('../protocols/device2')
const tunnel = require('../utils/ssh-tunnel')
const { insertOne } = require('../db/client')

const handleConnection = socket => {
  socket.setEncoding('ascii')
  tcpHandler.clients.add(socket)

  console.log('tcp client connected')

  new Device(socket)

  socket.on('error', error => console.error(error))

  socket.on('close', () => {
    console.log('tcp client closed')
    tcpHandler.clients.delete(socket)
  })
}

const tcpServer = createServer()
const tcpHandler = {
  clients: new Set(),
}

controller.tcpClients = tcpHandler.clients

tcpServer.on('connection', handleConnection)

const start = async port => {
  if (process.env.SSH) await tunnel(port)
  return new Promise((_, reject) => {
    tcpServer
      .listen(port, () => {
        console.log(`tcp server listening on port ${port}`)
      })
      .on('error', reject)
  })
}

module.exports = start
