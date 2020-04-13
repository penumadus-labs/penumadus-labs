const { createServer } = require('http')
const controller = require('./controller')
const WebSocket = require('ws')

class WSServer extends WebSocket.Server {
  constructor(expressApp, port) {
    const server = createServer(expressApp)
    super({ server })
    controller.add(this)
    this.port = port
    this.server = server

    this.on('connection', ws => {
      ws.send(Buffer.from('websocket connected'))
      ws.on('message', data => {
        controller.handleData(data, this)
      })
    })
  }
  sendAll(data) {
    for (const client of this.clients) client.send(data)
  }
  start() {
    this.server
      .listen(this.port, () => console.log('http ws server started'))
      .on('error', e => {
        console.error(e, 'problem with http server')
      })
  }
}

module.exports = WSServer
