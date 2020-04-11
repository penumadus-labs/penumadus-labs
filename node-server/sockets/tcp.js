const tunnel = require('../utils/ssh-tunnel')
const { insertOne } = require('../db/client')
const { Socket } = require('net')
const { promisify } = require('util')

const port = 32100
const tcpClient = new Socket()

tcpClient.on('data', data => {
  void (async () => {
    const doc = JSON.parse(data)
    const { type } = doc
    delete doc.type
    delete doc.pad
    switch (type) {
      case 'D':
        // await insertOne('data', doc)
        console.log('D!')
        break
      case 'A':
        // await insertOne('acceleration', doc)
        console.log('A!')
        break
      default:
        throw new Error('recived invalid packet type from tcp server')
    }
    console.log(doc)
  })().catch(e => {
    console.error(e)
    console.log(data)
  })
})

tcpClient.on('close', () => {})

tcpClient.on('error', err => {})

tcpClient.setEncoding('ascii')

tcpClient.connectAsync = promisify(tcpClient.connect)

const createTCPtcpClient = async dbtcpClient => {
  await tunnel(port)
  await tcpClient.connectAsync(port)
  console.log('tcp tcpClient connected')
}

module.exports = createTCPtcpClient
