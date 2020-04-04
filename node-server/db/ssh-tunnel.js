// this code maps a port from the dev server to the local machine for development

const { readFileSync } = require('fs')
const { promisify } = require('util')
const tunnel = require('tunnel-ssh')

const dstPort = '27017'
const privateKey = readFileSync(__dirname + '/../.ssh/server2.pem')

const config = {
  username: 'ubuntu',
  host: '18.222.29.175',
  port: '22',
  privateKey,
  dstPort,
}

function tunnelPromise() {
  return new Promise((resolve, reject) => {
    const client = tunnel(config, err => {
      if (err) reject(err)
      resolve()
    })

    client.on('error', reject)
  })
}

module.exports = tunnelPromise
