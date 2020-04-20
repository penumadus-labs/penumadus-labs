const controller = require('./controller')
const { createServer } = require('http')
const { Server } = require('ws')

const handleConnection = socket => {
  socket.send(Buffer.from('socket connected'))
  socket.on('message', handleData)
}

const handleData = async data => {
  try {
    console.log(`recieved "${data}" from web client`)
    controller.sendDataToAllTcpServerClients(data)
  } catch (e) {}
}

const start = async (expressApp, port) => {
  const server = createServer(expressApp)

  const webHandler = new Server({ server })
  controller.webClients = webHandler.clients

  webHandler.on('connection', handleConnection)

  return new Promise((_, reject) => {
    server
      .listen(port, () => {
        console.log(`web server listening on port ${port}`)
      })
      .on('error', reject)
  })
}

module.exports = start
