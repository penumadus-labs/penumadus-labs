const { createServer } = require('http')
const { createServer: createSecureServer } = require('https')
const { Server } = require('ws')
const broadcaster = require('../controllers/broadcaster')
const { verifyUserSocket } = require('../utils/auth')
const { readFileSync } = require('fs')
const { join } = require('path')

const certsDir = join(__dirname, '..', 'certs') + '/'

// const ssl = {
//   key: readFileSync(certsDir + 'privkey.pem'),
//   cert: readFileSync(certsDir + 'fullchain.pem'),
//   ca: readFileSync(certsDir + 'chain.pem'),
// }

const parseCookies = (cookies = '') =>
  cookies.split(';').reduce((acc, cookie) => {
    const parts = cookie.split('=')
    acc[parts.shift().trim()] = decodeURI(parts.join('='))
    return acc
  }, {})

module.exports = (app, port) => {
  const server = createServer(app)

  const wsServer = new Server({ noServer: true })
  broadcaster.users = wsServer.clients

  server.on('upgrade', (req, socket, head) => {
    // sessionStorage auth system
    const { token } = parseCookies(req.headers.cookie)
    if (!verifyUserSocket(token)) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
      return
    }

    wsServer.handleUpgrade(req, socket, head, (ws) => {
      // wsServer.emit('connection', ws, req)
      console.info('websocket connected')
    })
  })

  return new Promise((_, reject) => {
    server
      .listen(port, () => {
        console.info(`web server listening on port ${port}`)
      })
      .on('error', reject)
    // createSecureServer(app, ssl).listen(8443).on('error', reject)
  })
} // start web server
