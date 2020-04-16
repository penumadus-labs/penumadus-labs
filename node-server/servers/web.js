const controller = require('./controller')
const { createServer } = require('http')
const { Server } = require('ws')

const handleWebServerClient = socket => {
  socket.send(Buffer.from('socket connected'))
  socket.on('message', data => {
    console.log(`recieved "${data}" from web client`)
    controller.sendDataToAllTcpServerClients(data)
  })
}

module.exports = async (expressApp, port) => {
  const server = createServer(expressApp)

  const webHandler = new Server({ server })
  controller.webClients = webHandler.clients

  webHandler.on('connection', handleWebServerClient)

  return new Promise((_, reject) => {
    server
      .listen(port, () => {
        console.log(`web server listening on port ${port}`)
      })
      .on('error', reject)
  })
}
