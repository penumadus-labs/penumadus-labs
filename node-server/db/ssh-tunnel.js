const { readFileSync } = require('fs')
const { promisify } = require('util')
const tunnel = promisify(require('tunnel-ssh'))

const dstPort = '27017'
const privateKey = readFileSync('/Users/abram/.ssh/server2.pem')

const config = {
  username: 'ubuntu',
  host: '18.222.29.175',
  port: '22',
  privateKey,
  dstPort,
}

module.exports = async () => {
  const server = await tunnel(config)
  server.on('error', e => console.error(e))
}
