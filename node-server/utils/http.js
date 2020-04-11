const { createServer } = require('http')
const { createWebSocket } = require('../sockets')

const listen = (expressApp, port) => {
  const server = createServer(expressApp)
  createWebSocket(server)

  return new Promise((_, reject) => {
    server
      .listen(port, () => {
        console.log(`server listening on port ${port}\n`)
      })
      .on('error', reject)
  })
}

module.exports = listen
