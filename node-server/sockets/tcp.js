const tunnel = require('../utils/ssh-tunnel')
const { Socket } = require('net')
const { promisify } = require('util')

const port = 32100
const client = new Socket()

client.on('data', data => {
  const json = JSON.parse(data)
})

client.on('close', () => {})

client.on('error', err => {})

client.setEncoding('ascii')

client.asyncConnect = promisify(client.connect)

const createTCPClient = async () => {
  await tunnel(port)
  await client.asyncConnect(port)
  console.log('tcp client connected')
  return client
}

module.exports = createTCPClient
