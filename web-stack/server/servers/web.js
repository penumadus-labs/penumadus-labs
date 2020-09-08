const { createServer } = require('http')
const { Server } = require('ws')
const channel = require('../controllers/channel')
const { verifyUserSocket } = require('../utils/auth')

const parseCookies = (cookies = '') =>
  cookies.split(';').reduce((acc, cookie) => {
    const parts = cookie.split('=')
    acc[parts.shift().trim()] = decodeURI(parts.join('='))
    return acc
  }, {})

const start = async (expressApp, port) => {
  const server = createServer(expressApp)

  const wsServer = new Server({ noServer: true })
  channel.users = wsServer.clients

  server.on('upgrade', (req, socket, head) => {
    // const token = req.headers['sec-websocket-protocol']
    const { token } = parseCookies(req.headers.cookie)
    if (!verifyUserSocket(token)) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
    }

    wsServer.handleUpgrade(req, socket, head, (ws) => {
      wsServer.emit('connection', ws, req)
    })
  })

  return new Promise((_, reject) => {
    server
      .listen(port, () => {
        console.info(`web server listening on port ${port}`)
      })
      .on('error', reject)
  })
}

module.exports = start
