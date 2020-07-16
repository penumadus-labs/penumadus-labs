const { createServer } = require('http')
const { Server } = require('ws')
const controller = require('../controllers/bridge')

const start = async (expressApp, port) => {
  const server = createServer(expressApp)

  const webHandler = new Server({ server })
  controller.users = webHandler.clients

  // webHandler.on('connection', (socket) => {
  //   socket.on('error', () => {
  //   })
  // })

  // webHandler.on('error', () => {
  // })

  return new Promise((_, reject) => {
    server
      .listen(port, () => {
        console.info(`web server listening on port ${port}`)
      })
      .on('error', reject)
  })
}

module.exports = start
