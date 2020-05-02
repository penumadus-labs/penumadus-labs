const net = require('net')
const controller = require('./controller')
const Device = require('../protocols/device2')
const tunnel = require('../utils/ssh-tunnel')
const { insertOne } = require('../db/client')

class X extends net.Socket {}

net.Socket.prototype = net.Socket.prototype

const handleConnection = socket => {

  console.log(socket)

  socket.setEncoding('ascii')
  const device = new Device(socket)
  const ref = device
  tcpHandler.clients.add(ref)

  console.log('tcp client connected')


  socket.on('error', error => console.error(error))

  socket.on('close', () => {
    console.log('tcp client closed')
    tcpHandler.clients.delete(ref)
  })
}

const tcpServer = net.createServer()
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
