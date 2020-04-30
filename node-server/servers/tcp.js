const { createServer } = require('net')
const controller = require('./controller')
const tunnel = require('../utils/ssh-tunnel')
const { insertOne } = require('../db/client')

const handleData = async data => {
  try {
    const doc = JSON.parse(data)
    const { type } = doc
    delete doc.type
    delete doc.pad
    switch (type) {
      case 'D':
        console.log('standard')
        // await insertOne('hank_1', 'standard_data', doc)
        break
      case 'A':
        console.log('acceleration')
        // await insertOne('hank_1', 'acceleration_data', doc)
        // console.log('A!')
        break
      case 'HELLO':
        break
      case 'GETPRESS':
        console.log('get-pressure')
        break
      default:
        console.log(`invalid case: ${type}`)
      // throw new Error('recived invalid packet type from tcp server')
    }
  } catch (e) {
    console.error(e)
  }
}

const handleConnection = socket => {
  socket.setEncoding('ascii')
  tcpHandler.clients.add(socket)

  console.log('tcp client connected')
  socket.write('GETPRESS'.padEnd(200))

  socket.on('data', handleData)

  socket.on('close', () => {
    console.log('tcp client closed')
    tcpHandler.clients.delete(socket)
  })
}

const tcpServer = createServer()
const tcpHandler = {
  clients: new Set(),
}

controller.tcpClients = tcpHandler.clients

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
