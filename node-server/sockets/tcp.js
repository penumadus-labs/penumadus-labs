const tunnel = require('../utils/ssh-tunnel')
const { Socket } = require('net')
const { promisify } = require('util')

const client = new Socket()

client.on('data', data => {
  console.log(data.toString())

  const json = JSON.parse(data.toString().split('\0')[0])

  console.log(json)
})

client.on('close', () => {})

client.on('error', err => {})

const connect = promisify(client.connect.bind(client))

const port = 32100

void (async () => {
  await tunnel(port)

  client.connect(port, () => console.log('tcp connected'))
})().catch(console.error)
