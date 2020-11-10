const { createServer } = require('http')
const { Server } = require('ws')
const broadcaster = require('../controllers/broadcaster')
const { verifyUserSocket } = require('../utils/auth')

const parseCookies = (cookies = '') =>
  cookies.split(';').reduce((acc, cookie) => {
    const parts = cookie.split('=')
    acc[parts.shift().trim()] = decodeURI(parts.join('='))
    return acc
  }, {})

module.exports = (expressApp, port) => {
  const server = createServer(expressApp)

  const wsServer = new Server({ noServer: true })
  broadcaster.users = wsServer.clients

  server.on('upgrade', (req, socket, head) => {
    // sessionStorage auth system
    const { token } = parseCookies(req.headers.cookie)
    if (!verifyUserSocket(token)) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
    }

    wsServer.handleUpgrade(req, socket, head, (ws) => {
      wsServer.emit('connection', ws, req)
      console.info('websocket connected')
    })
  })

  return new Promise((_, reject) => {
    server
      .listen(port, () => {
        console.info(`web server listening on port ${port}`)
      })
      .on('error', reject)
  })
} // start web server
