const controller = require('./controller')
const { createServer } = require('net')

const handleTcpServerClient = socket => {
  tcpHandler.clients.add(socket)

  socket.on('data', data => {
    console.log(`recieved "${data}" from tcp client`)

    controller.sendDataToAllWebServerClients(data)
  })
  socket.on('close', () => {
    tcpHandler.clients.delete(socket)
  })
}

const tcpServer = createServer()
const tcpHandler = {
  clients: new Set(),
}
controller.tcpClients = tcpHandler.clients

tcpServer.on('connection', handleTcpServerClient)

module.exports = port => {
  return new Promise((_, reject) => {
    tcpServer
      .listen(port, () => {
        console.log(`tcp server listening on port ${port}`)
      })
      .on('error', reject)
  })
}
