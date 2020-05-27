const { createServer } = require('http')
const { Server } = require('ws')
const controller = require('../controllers/bridge')

const handleConnection = (socket) => {
  socket.send(Buffer.from(JSON.stringify({ status: 'socket connected' })))
  socket.on('message', handleData)
}

const handleData = async (data) => {
  try {
    controller.sendDataToTCPClients(data)
  } catch (e) {}
}

const start = async (expressApp, port) => {
  const server = createServer(expressApp)

  const webHandler = new Server({ server })
  controller.users = webHandler.clients

  webHandler.on('connection', handleConnection)

  return new Promise((_, reject) => {
    server
      .listen(port, () => {
        console.info(`web server listening on port ${port}`)
      })
      .on('error', reject)
  })
}

module.exports = start
