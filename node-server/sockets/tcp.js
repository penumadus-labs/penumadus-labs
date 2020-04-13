const net = require('net')
const controller = require('./controller')
const tunnel = require('../utils/ssh-tunnel')

class TCPServer extends net.Server {
  constructor(port, ...args) {
    super(...args)
    this.clients = new Set()
    this.port = port
    controller.add(this)

    this.on('connection', socket => {
      this.clients.add(socket)

      socket.on('data', data => {
        controller.handleData(data, this)
      })

      socket.on('close', () => {
        this.clients.delete(socket)
      })
    })
  }
  sendAll(data) {
    for (const client of this.clients) client.write(data)
  }
  async start() {
    // if (process.env.NODE_ENV === 'development') await tunnel(this.port)
    this.listen(this.port, () => console.log('tcp server started')).on(
      'error',
      e => console.error(e, 'problem with tcp server')
    )
  }
}

module.exports = TCPServer
