const { createServer } = require('net')
const controller = require('./controller')
const { insertOne } = require('../db/client')
const tunnel = require('../utils/ssh-tunnel')

const tcpServer = createServer()
const tcpHandler = {
  clients: new Set(),
}
controller.tcpClients = tcpHandler.clients

const handleConnection = socket => {
  socket.setEncoding('ascii')
  tcpHandler.clients.add(socket)

  console.log('tcp client connected')
  socket.write('GETPRESS'.padEnd(200))

  socket.on('data', handleData)

  socket.on('close', () => {
    console.log('closed')
    tcpHandler.clients.delete(socket)
  })
}

const handleData = async data => {
  console.log(data)
  try {
    if (data.length > 200) throw Error('data packet too large')
    const doc = JSON.parse(data)
    const { type } = doc
    delete doc.type
    delete doc.pad
    switch (type) {
      case 'D':

        // await insertOne('hank_1', 'standard_data', doc)
        break
      case 'A':
        // await insertOne('hank_1', 'acceleration_data', doc)
        // console.log('A!')
        break
      case 'HELLO':
        controller.sendDataToWebClients(
          Buffer.from(JSON.stringify({ status: `${doc.id} alive` }))
        )
        break
      default:
        throw new Error('recived invalid packet type from tcp server')
    }
  } catch (e) {
    console.error(e)
  }
}

tcpServer.on('connection', handleConnection)

const start = async port => {
  if (process.env.SSH) await tunnel(port)
  return new Promise((_, reject) => {
    tcpServer
      .listen(port, () => {
        console.log(`tcp server listening on port ${port}`)
      })
      .on('error', reject)
  })
}

module.exports = start
